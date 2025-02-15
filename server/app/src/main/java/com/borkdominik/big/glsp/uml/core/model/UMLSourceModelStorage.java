/********************************************************************************
 * Copyright (c) 2024 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.borkdominik.big.glsp.uml.core.model;

import java.io.IOException;

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.ecore.EPackage;
import org.eclipse.emf.ecore.resource.ResourceSet;
import org.eclipse.glsp.server.emf.EMFIdGenerator;
import org.eclipse.glsp.server.emf.model.notation.NotationFactory;
import org.eclipse.glsp.server.features.core.model.RequestModelAction;
import org.eclipse.glsp.server.types.GLSPServerException;
import org.eclipse.uml2.uml.Model;
import org.eclipse.uml2.uml.UMLFactory;
import org.eclipse.uml2.uml.UMLPackage;

import com.borkdominik.big.glsp.server.core.handler.action.new_file.BGRequestNewFileAction;
import com.borkdominik.big.glsp.server.core.model.integrations.BGEMFSourceModelStorage;
import com.borkdominik.big.glsp.uml.unotation.UMLDiagram;
import com.borkdominik.big.glsp.uml.unotation.UnotationFactory;
import com.borkdominik.big.glsp.uml.unotation.UnotationPackage;
import com.google.inject.Inject;

public class UMLSourceModelStorage extends BGEMFSourceModelStorage {

   @Inject
   protected EMFIdGenerator idGenerator;

   @Inject
   protected UMLModelMigrator migrator;

   @Override
   protected ResourceSet setupResourceSet(final ResourceSet resourceSet) {
      super.setupResourceSet(resourceSet);
      resourceSet.getPackageRegistry().put(UMLPackage.eINSTANCE.getNsURI(), UMLPackage.eINSTANCE);
      resourceSet.getPackageRegistry().put(UnotationPackage.eINSTANCE.getNsURI(), UnotationPackage.eINSTANCE);
      return resourceSet;
   }

   @Override
   protected void loadNotationModel(ResourceSet resourceSet, URI sourceURI, RequestModelAction action) {
      // Migrate the notation model file if necessary
      migrator.migrateNotationModel(resourceSet, deriveNotationModelURI(sourceURI), action);

      super.loadNotationModel(resourceSet, sourceURI, action);
   }

   @Override
   protected URI deriveNotationModelURI(final URI sourceURI) {
      return sourceURI.trimFileExtension().appendFileExtension("unotation");
   }

   @Override
   protected void doCreateSourceModel(final ResourceSet resourceSet, final URI resourceURI,
         final BGRequestNewFileAction action) {
      var packageRegistry = resourceSet.getPackageRegistry();

      packageRegistry.entrySet().stream()
            .filter(entry -> {
               var value = entry.getValue();
               return value instanceof UMLPackage || value instanceof UnotationPackage;
            })
            .forEach((entry) -> {
               var ePackage = (EPackage) entry.getValue();
               doCreateResource(resourceSet, ePackage, resourceURI);
            });

      var umlFile = resourceURI.appendFileExtension(UMLPackage.eINSTANCE.getNsPrefix());
      var umlResource = resourceSet.getResource(umlFile, false);
      var unotationFile = resourceURI.appendFileExtension(UnotationPackage.eINSTANCE.getNsPrefix());
      var unotationResource = resourceSet.getResource(unotationFile, false);

      var model = (Model) umlResource.getAllContents().next();
      var diagram = (UMLDiagram) unotationResource.getAllContents().next();
      var semanticProxy = NotationFactory.eINSTANCE
            .createSemanticElementReference();
      semanticProxy.setElementId(idGenerator.getOrCreateId(model));
      diagram.setSemanticElement(semanticProxy);
      diagram.setDiagramType(action.getDiagramType());

      try {
         unotationResource.save(null);
      } catch (IOException e) {
         throw new GLSPServerException("Failed to save file", e);
      }
   }

   @Override
   protected EObject doCreateResourceContent(final EPackage ePackage) {
      if (ePackage.equals(UMLPackage.eINSTANCE)) {
         return UMLFactory.eINSTANCE.createModel();
      } else if (ePackage.equals(UnotationPackage.eINSTANCE)) {
         return UnotationFactory.eINSTANCE.createUMLDiagram();
      }

      return super.doCreateResourceContent(ePackage);
   }
}
