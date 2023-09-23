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
package com.eclipsesource.uml.glsp.uml.elements.pin;

import com.eclipsesource.uml.glsp.uml.configuration.di.NodeConfigurationFactory;
import com.eclipsesource.uml.glsp.uml.elements.pin.gmodel.OutputPinNodeMapper;
import com.eclipsesource.uml.glsp.uml.gmodel.di.GModelMapperFactory;
import com.eclipsesource.uml.glsp.uml.handler.di.NodeOperationHandlerFactory;
import com.eclipsesource.uml.modelserver.unotation.Representation;

public interface OutputPinFactory
   extends NodeConfigurationFactory, NodeOperationHandlerFactory, GModelMapperFactory {

   @Override
   OutputPinConfiguration nodeConfiguration(Representation representation);

   @Override
   OutputPinOperationHandler nodeOperationHandler(Representation representation);

   @Override
   OutputPinNodeMapper gmodel(Representation representation);
}
