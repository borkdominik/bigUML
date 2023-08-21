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
package com.eclipsesource.uml.glsp.uml.elements.class_;

import com.eclipsesource.uml.glsp.uml.configuration.di.NodeConfigurationFactory;
import com.eclipsesource.uml.glsp.uml.elements.class_.features.ClassLabelEditMapper;
import com.eclipsesource.uml.glsp.uml.elements.class_.features.ClassPropertyMapper;
import com.eclipsesource.uml.glsp.uml.elements.class_.gmodel.ClassNodeMapper;
import com.eclipsesource.uml.glsp.uml.features.label_edit.di.LabelEditMapperFactory;
import com.eclipsesource.uml.glsp.uml.features.property_palette.di.PropertyMapperFactory;
import com.eclipsesource.uml.glsp.uml.gmodel.di.GModelMapperFactory;
import com.eclipsesource.uml.glsp.uml.handler.di.NodeOperationHandlerFactory;
import com.eclipsesource.uml.modelserver.unotation.Representation;

public interface ClassFactory
   extends NodeConfigurationFactory, NodeOperationHandlerFactory, GModelMapperFactory, PropertyMapperFactory,
   LabelEditMapperFactory {
   @Override
   ClassConfiguration nodeConfiguration(Representation representation);

   @Override
   ClassNodeMapper gmodel(Representation representation);

   @Override
   ClassOperationHandler nodeOperationHandler(Representation representation);

   @Override
   ClassLabelEditMapper labelEditMapper(Representation representation);

   @Override
   ClassPropertyMapper elementPropertyMapper(Representation representation);
}
