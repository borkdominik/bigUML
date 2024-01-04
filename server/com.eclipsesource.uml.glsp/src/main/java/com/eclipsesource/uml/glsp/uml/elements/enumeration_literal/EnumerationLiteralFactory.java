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
package com.eclipsesource.uml.glsp.uml.elements.enumeration_literal;

import com.eclipsesource.uml.glsp.uml.configuration.di.NodeConfigurationFactory;
import com.eclipsesource.uml.glsp.uml.elements.enumeration_literal.features.EnumerationLiteralLabelEditMapper;
import com.eclipsesource.uml.glsp.uml.elements.enumeration_literal.features.EnumerationLiteralPropertyMapper;
import com.eclipsesource.uml.glsp.uml.elements.enumeration_literal.gmodel.EnumerationLiteralGModelMapper;
import com.eclipsesource.uml.glsp.uml.features.label_edit.di.LabelEditMapperFactory;
import com.eclipsesource.uml.glsp.uml.features.property_palette.di.PropertyMapperFactory;
import com.eclipsesource.uml.glsp.uml.gmodel.di.GModelMapperFactory;
import com.eclipsesource.uml.glsp.uml.handler.di.NodeOperationHandlerFactory;
import com.eclipsesource.uml.modelserver.unotation.Representation;

public interface EnumerationLiteralFactory
   extends NodeConfigurationFactory, NodeOperationHandlerFactory, GModelMapperFactory, PropertyMapperFactory,
   LabelEditMapperFactory {
   @Override
   EnumerationLiteralConfiguration nodeConfiguration(Representation representation);

   @Override
   EnumerationLiteralGModelMapper gmodel(Representation representation);

   @Override
   EnumerationLiteralOperationHandler nodeOperationHandler(Representation representation);

   @Override
   EnumerationLiteralLabelEditMapper labelEditMapper(Representation representation);

   @Override
   EnumerationLiteralPropertyMapper elementPropertyMapper(Representation representation);
}
