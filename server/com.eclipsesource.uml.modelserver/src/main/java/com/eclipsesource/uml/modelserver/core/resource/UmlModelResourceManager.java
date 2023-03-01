/********************************************************************************
 * Copyright (c) 2021-2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.modelserver.core.resource;

import java.io.File;
import java.io.IOException;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import org.eclipse.emf.common.notify.AdapterFactory;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.ecore.resource.Resource;
import org.eclipse.emf.ecore.resource.ResourceSet;
import org.eclipse.emf.ecore.util.EcoreUtil;
import org.eclipse.emfcloud.modelserver.emf.common.RecordingModelResourceManager;
import org.eclipse.emfcloud.modelserver.emf.common.watchers.ModelWatchersManager;
import org.eclipse.emfcloud.modelserver.emf.configuration.EPackageConfiguration;
import org.eclipse.emfcloud.modelserver.emf.configuration.ServerConfiguration;
import org.eclipse.emfcloud.modelserver.emf.util.JsonPatchHelper;
import org.eclipse.emfcloud.modelserver.integration.SemanticFileExtension;
import org.eclipse.emfcloud.modelserver.notation.integration.NotationFileExtension;
import org.eclipse.glsp.server.emf.model.notation.NotationFactory;
import org.eclipse.uml2.uml.Model;
import org.eclipse.uml2.uml.Type;
import org.eclipse.uml2.uml.UMLFactory;
import org.eclipse.uml2.uml.resource.UMLResource;

import com.eclipsesource.uml.modelserver.core.models.TypeInformation;
import com.eclipsesource.uml.modelserver.shared.extension.SemanticElementAccessor;
import com.eclipsesource.uml.modelserver.shared.utils.UmlNotationUtil;
import com.eclipsesource.uml.modelserver.unotation.UmlDiagram;
import com.eclipsesource.uml.modelserver.unotation.UnotationFactory;
import com.google.inject.Inject;
import com.google.inject.Provider;

public class UmlModelResourceManager extends RecordingModelResourceManager {

   @Inject
   @SemanticFileExtension
   protected String semanticFileExtension;
   @Inject
   @NotationFileExtension
   protected String notationFileExtension;

   @Inject
   public UmlModelResourceManager(final Set<EPackageConfiguration> configurations, final AdapterFactory adapterFactory,
      final ServerConfiguration serverConfiguration, final ModelWatchersManager watchersManager,
      final Provider<JsonPatchHelper> jsonPatchHelper) {
      super(configurations, adapterFactory, serverConfiguration, watchersManager, jsonPatchHelper);
   }

   @Override
   protected void loadSourceResources(final String directoryPath) {
      if (directoryPath == null || directoryPath.isEmpty()) {
         return;
      }
      var directory = new File(directoryPath);
      var list = directory.listFiles();
      Arrays.sort(list);

      for (var file : list) {
         if (isSourceDirectory(file)) {
            loadSourceResources(file.getAbsolutePath());
         } else if (file.isFile()) {
            var resourceURI = URI.createFileURI(file.getAbsolutePath());

            if (UMLResource.FILE_EXTENSION.equals(resourceURI.fileExtension())) {
               getUmlResourceSet(resourceURI);
            }

            loadResource(resourceURI.toString());
         }
      }
   }

   @Override
   public ResourceSet getResourceSet(final String modeluri) {
      var resourceURI = createURI(modeluri);

      if (notationFileExtension.equals(resourceURI.fileExtension())) {
         var semanticUri = resourceURI.trimFileExtension().appendFileExtension(semanticFileExtension);
         return getUmlResourceSet(semanticUri);
      }

      return resourceSets.get(resourceURI);
   }

   /**
    * Get the resource set that manages the given UML semantic model resource, creating
    * it if necessary.
    *
    * @param modelURI a UML semantic model resource URI
    * @return its resource set
    */
   public ResourceSet getUmlResourceSet(final URI modelURI) {
      var result = resourceSets.get(modelURI);
      if (result == null) {
         result = resourceSetFactory.createResourceSet(modelURI);
         resourceSets.put(modelURI, result);
      }
      return result;
   }

   @Override
   public boolean save(final String modeluri) {
      var result = false;
      for (var resource : getResourceSet(modeluri).getResources()) {
         result = saveResource(resource) || result;
      }
      if (result) {
         getEditingDomain(getResourceSet(modeluri)).saveIsDone();
      }
      return result;
   }

   @Override
   protected boolean saveResource(final Resource resource) {
      if (resource.getURI() != null) {
         try {
            resource.save(Map.of());
            return true;
         } catch (IOException e) {
            LOG.error("Could not save resource: " + resource.getURI(), e);
         }
      }
      return false;
   }

   public boolean createUmlModel(final String modeluri, final String diagramType) {
      var umlModelUri = createURI(modeluri);
      var resourceSet = resourceSetFactory.createResourceSet(umlModelUri);
      resourceSets.put(umlModelUri, resourceSet);

      final var umlModel = createNewModel(umlModelUri);

      try {
         final var umlResource = resourceSet.createResource(umlModelUri);
         resourceSet.getResources().add(umlResource);
         umlResource.getContents().add(umlModel);
         umlResource.save(null);

         final var umlNotationResource = resourceSet
            .createResource(umlModelUri.trimFileExtension().appendFileExtension(notationFileExtension));
         resourceSet.getResources().add(umlNotationResource);
         umlNotationResource.getContents().add(createNewDiagram(umlModel, diagramType));
         umlNotationResource.save(null);
         createEditingDomain(resourceSet);

      } catch (IOException e) {
         return false;
      }

      return true;
   }

   public Set<TypeInformation> getUmlTypeInformation(final String modelUri) {
      return modelRepository.loadResource(modelUri).map(resource -> {
         var types = new HashSet<TypeInformation>();
         var contents = resource.getAllContents();

         while (contents.hasNext()) {
            var res = contents.next();
            if (res instanceof Type) {
               var type = (Type) res;
               types.add(new TypeInformation((that) -> {
                  that.modelUri = modelUri;
                  that.id = SemanticElementAccessor.getId(type);

                  var simpleName = type.getClass().getSimpleName().replace("Impl", "");

                  that.name = type.getName() == null || type.getName().isBlank() ? simpleName : type.getName();
                  that.type = simpleName;
               }));
            }
         }

         return types;
      }).orElse(new HashSet<>());
   }

   protected Model createNewModel(final URI modelUri) {
      var newModel = UMLFactory.eINSTANCE.createModel();
      var modelName = modelUri.lastSegment().split("." + modelUri.fileExtension())[0];

      newModel.setName(modelName);

      return newModel;
   }

   protected UmlDiagram createNewDiagram(final Model model, final String diagramType) {
      var newDiagram = UnotationFactory.eINSTANCE.createUmlDiagram();
      var semanticProxy = NotationFactory.eINSTANCE.createSemanticElementReference();

      semanticProxy.setElementId(EcoreUtil.getURI(model).fragment());
      newDiagram.setSemanticElement(semanticProxy);
      newDiagram.setDiagramType(diagramType);
      newDiagram.setRepresentation(UmlNotationUtil.getRepresentation(diagramType));

      return newDiagram;
   }
}
