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
package com.eclipsesource.uml.glsp.uml.elements.interface_;

import com.eclipsesource.uml.glsp.uml.configuration.di.NodeConfigurationFactory;
import com.eclipsesource.uml.glsp.uml.elements.interface_.features.InterfaceLabelEditMapper;
import com.eclipsesource.uml.glsp.uml.elements.interface_.features.InterfacePropertyMapper;
import com.eclipsesource.uml.glsp.uml.elements.interface_.gmodel.InterfaceGModelMapper;
import com.eclipsesource.uml.glsp.uml.features.label_edit.di.LabelEditMapperFactory;
import com.eclipsesource.uml.glsp.uml.features.property_palette.di.PropertyMapperFactory;
import com.eclipsesource.uml.glsp.uml.gmodel.di.GModelMapperFactory;
import com.eclipsesource.uml.glsp.uml.handler.di.NodeOperationHandlerFactory;
import com.eclipsesource.uml.modelserver.unotation.Representation;

public interface InterfaceFactory
   extends NodeConfigurationFactory, NodeOperationHandlerFactory, GModelMapperFactory, PropertyMapperFactory,
   LabelEditMapperFactory {
   @Override
   InterfaceConfiguration nodeConfiguration(Representation representation);

   @Override
   InterfaceGModelMapper gmodel(Representation representation);

   @Override
   InterfaceOperationHandler nodeOperationHandler(Representation representation);

   @Override
   InterfaceLabelEditMapper labelEditMapper(Representation representation);

   @Override
   InterfacePropertyMapper elementPropertyMapper(Representation representation);
}
