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
package com.eclipsesource.uml.glsp.uml.elements.pseudostate;

import com.eclipsesource.uml.glsp.uml.configuration.di.NodeConfigurationFactory;
import com.eclipsesource.uml.glsp.uml.elements.pseudostate.gmodel.PseudostateNodeMapper;
import com.eclipsesource.uml.glsp.uml.gmodel.di.GModelMapperFactory;
import com.eclipsesource.uml.glsp.uml.handler.di.NodeOperationHandlerFactory;
import com.eclipsesource.uml.modelserver.unotation.Representation;

public interface PseudostateFactory
   extends NodeConfigurationFactory, NodeOperationHandlerFactory, GModelMapperFactory {
   @Override
   PseudostateConfiguration nodeConfiguration(Representation representation);

   @Override
   PseudostateNodeMapper gmodel(Representation representation);

   @Override
   PseudostateOperationHandler nodeOperationHandler(Representation representation);
}
