/********************************************************************************
 * Copyright (c) 2023 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.uml.elements.manifestation;

import com.eclipsesource.uml.glsp.uml.configuration.di.EdgeConfigurationFactory;
import com.eclipsesource.uml.glsp.uml.elements.manifestation.features.ManifestationLabelEditMapper;
import com.eclipsesource.uml.glsp.uml.elements.manifestation.features.ManifestationPropertyMapper;
import com.eclipsesource.uml.glsp.uml.elements.manifestation.gmodel.ManifestationEdgeMapper;
import com.eclipsesource.uml.glsp.uml.features.label_edit.di.LabelEditMapperFactory;
import com.eclipsesource.uml.glsp.uml.features.property_palette.di.PropertyMapperFactory;
import com.eclipsesource.uml.glsp.uml.gmodel.di.GModelMapperFactory;
import com.eclipsesource.uml.glsp.uml.handler.di.EdgeOperationHandlerFactory;
import com.eclipsesource.uml.modelserver.unotation.Representation;

public interface ManifestationFactory
   extends EdgeConfigurationFactory, EdgeOperationHandlerFactory, GModelMapperFactory, PropertyMapperFactory,
   LabelEditMapperFactory {

   @Override
   ManifestationConfiguration edgeConfiguration(Representation representation);

   @Override
   ManifestationEdgeMapper gmodel(Representation representation);

   @Override
   ManifestationOperationHandler edgeOperationHandler(Representation representation);

   @Override
   ManifestationPropertyMapper elementPropertyMapper(Representation representation);

   @Override
   ManifestationLabelEditMapper labelEditMapper(Representation representation);

}
