/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.modelserver;

import java.io.IOException;
import java.util.Collections;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.ecore.resource.ResourceSet;
import org.eclipse.emfcloud.modelserver.emf.common.DefaultResourceSetFactory;
import org.eclipse.emfcloud.modelserver.integration.SemanticFileExtension;
import org.eclipse.emfcloud.modelserver.notation.integration.NotationFileExtension;
import org.eclipse.uml2.uml.resource.UMLResource;
import org.eclipse.uml2.uml.resources.util.UMLResourcesUtil;

import com.eclipsesource.uml.modelserver.resource.UmlNotationResource;
import com.google.inject.Inject;

public class UmlResourceSetFactory extends DefaultResourceSetFactory {

   protected static final Logger LOG = LogManager.getLogger(UmlResourceSetFactory.class);

   @Inject
   @SemanticFileExtension
   protected String semanticFileExtension;
   @Inject
   @NotationFileExtension
   protected String notationFileExtension;

   @Override
   public ResourceSet createResourceSet(final URI modelURI) {
      var resourceSet = super.createResourceSet(modelURI);

      resourceSet.getResourceFactoryRegistry().getExtensionToFactoryMap().put(
         semanticFileExtension, UMLResource.Factory.INSTANCE);
      resourceSet.getResourceFactoryRegistry().getExtensionToFactoryMap().put(
         notationFileExtension, UmlNotationResource.FACTORY);

      UMLResourcesUtil.init(resourceSet);
      loadResourceLibraries(resourceSet);

      return resourceSet;
   }

   protected void loadResourceLibraries(final ResourceSet resourceSet) {
      try {
         resourceSet.getResource(URI.createURI(UMLResource.UML_PRIMITIVE_TYPES_LIBRARY_URI), true)
            .load(Collections.EMPTY_MAP);
         resourceSet.getResource(URI.createURI(UMLResource.ECORE_PRIMITIVE_TYPES_LIBRARY_URI), true)
            .load(Collections.EMPTY_MAP);
         resourceSet.getResource(URI.createURI(UMLResource.ECORE_PROFILE_URI), true)
            .load(Collections.EMPTY_MAP);
      } catch (IOException e) {
         LOG.debug("Could not load resource libraries for resourceSet with URI: " + resourceSet.toString());
         e.printStackTrace();
      }
   }

}
