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
package com.eclipsesource.uml.glsp.uml.elements.information_flow;

import com.eclipsesource.uml.glsp.uml.configuration.di.EdgeConfigurationFactory;
import com.eclipsesource.uml.glsp.uml.elements.information_flow.features.InformationFlowLabelEditMapper;
import com.eclipsesource.uml.glsp.uml.elements.information_flow.features.InformationFlowPropertyMapper;
import com.eclipsesource.uml.glsp.uml.elements.information_flow.gmodel.InformationFlowEdgeMapper;
import com.eclipsesource.uml.glsp.uml.features.label_edit.di.LabelEditMapperFactory;
import com.eclipsesource.uml.glsp.uml.features.property_palette.di.PropertyMapperFactory;
import com.eclipsesource.uml.glsp.uml.gmodel.di.GModelMapperFactory;
import com.eclipsesource.uml.glsp.uml.handler.di.EdgeOperationHandlerFactory;
import com.eclipsesource.uml.modelserver.unotation.Representation;

public interface InformationFlowFactory
   extends EdgeConfigurationFactory, EdgeOperationHandlerFactory, GModelMapperFactory, LabelEditMapperFactory,
   PropertyMapperFactory {

   @Override
   InformationFlowConfiguration edgeConfiguration(Representation representation);

   @Override
   InformationFlowEdgeMapper gmodel(Representation representation);

   @Override
   InformationFlowOperationHandler edgeOperationHandler(Representation representation);

   @Override
   InformationFlowPropertyMapper elementPropertyMapper(Representation representation);

   @Override
   InformationFlowLabelEditMapper labelEditMapper(Representation representation);
}
