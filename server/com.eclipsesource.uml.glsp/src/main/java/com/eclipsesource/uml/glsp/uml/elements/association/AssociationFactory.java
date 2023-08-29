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
package com.eclipsesource.uml.glsp.uml.elements.association;

import com.eclipsesource.uml.glsp.uml.configuration.di.EdgeConfigurationFactory;
import com.eclipsesource.uml.glsp.uml.elements.association.features.AssociationLabelEditMapper;
import com.eclipsesource.uml.glsp.uml.elements.association.features.AssociationPropertyMapper;
import com.eclipsesource.uml.glsp.uml.elements.association.gmodel.AssociationEdgeMapper;
import com.eclipsesource.uml.glsp.uml.features.label_edit.di.LabelEditMapperFactory;
import com.eclipsesource.uml.glsp.uml.features.property_palette.di.PropertyMapperFactory;
import com.eclipsesource.uml.glsp.uml.gmodel.di.GModelMapperFactory;
import com.eclipsesource.uml.glsp.uml.handler.di.EdgeOperationHandlerFactory;
import com.eclipsesource.uml.modelserver.unotation.Representation;

public interface AssociationFactory
   extends EdgeConfigurationFactory, EdgeOperationHandlerFactory, GModelMapperFactory, PropertyMapperFactory,
   LabelEditMapperFactory {

   @Override
   AssociationConfiguration edgeConfiguration(Representation representation);

   @Override
   AssociationEdgeMapper gmodel(Representation representation);

   @Override
   AssociationOperationHandler edgeOperationHandler(Representation representation);

   @Override
   AssociationPropertyMapper elementPropertyMapper(Representation representation);

   @Override
   AssociationLabelEditMapper labelEditMapper(Representation representation);
}
