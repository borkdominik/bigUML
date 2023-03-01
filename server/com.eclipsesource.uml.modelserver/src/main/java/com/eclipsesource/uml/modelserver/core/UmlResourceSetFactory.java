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
package com.eclipsesource.uml.modelserver.core;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.ecore.resource.ResourceSet;
import org.eclipse.emfcloud.modelserver.emf.common.DefaultResourceSetFactory;
import org.eclipse.emfcloud.modelserver.integration.SemanticFileExtension;
import org.eclipse.emfcloud.modelserver.notation.integration.NotationFileExtension;
import org.eclipse.emfcloud.modelserver.notation.integration.NotationResource;
import org.eclipse.uml2.uml.resource.UMLResource;
import org.eclipse.uml2.uml.resources.util.UMLResourcesUtil;

import com.eclipsesource.uml.modelserver.core.resource.notation.UmlNotationResource;
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
      resourceSet.getResourceFactoryRegistry().getExtensionToFactoryMap().put(
         NotationResource.FILE_EXTENSION, NotationResource.FACTORY);

      UMLResourcesUtil.init(resourceSet);

      return resourceSet;
   }
}
