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
package com.eclipsesource.uml.glsp.uml.elements.lifeline;

import com.eclipsesource.uml.glsp.uml.configuration.di.NodeConfigurationFactory;
import com.eclipsesource.uml.glsp.uml.elements.lifeline.features.LifelineLabelEditMapper;
import com.eclipsesource.uml.glsp.uml.elements.lifeline.gmodel.LifelineNodeMapper;
import com.eclipsesource.uml.glsp.uml.features.label_edit.di.LabelEditMapperFactory;
import com.eclipsesource.uml.glsp.uml.gmodel.di.GModelMapperFactory;
import com.eclipsesource.uml.glsp.uml.handler.di.NodeOperationHandlerFactory;
import com.eclipsesource.uml.modelserver.unotation.Representation;

public interface LifelineFactory
   extends NodeConfigurationFactory, NodeOperationHandlerFactory, GModelMapperFactory,
   LabelEditMapperFactory {
   @Override
   LifelineConfiguration nodeConfiguration(Representation representation);

   @Override
   LifelineNodeMapper gmodel(Representation representation);

   @Override
   LifelineOperationHandler nodeOperationHandler(Representation representation);

   @Override
   LifelineLabelEditMapper labelEditMapper(Representation representation);

}
