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
package com.eclipsesource.uml.glsp.uml.elements.deployment_specification;

import com.eclipsesource.uml.glsp.uml.configuration.di.NodeConfigurationFactory;
import com.eclipsesource.uml.glsp.uml.elements.deployment_specification.features.DeploymentSpecificationLabelEditMapper;
import com.eclipsesource.uml.glsp.uml.elements.deployment_specification.features.DeploymentSpecificationPropertyMapper;
import com.eclipsesource.uml.glsp.uml.elements.deployment_specification.gmodel.DeploymentSpecificationNodeMapper;
import com.eclipsesource.uml.glsp.uml.features.label_edit.di.LabelEditMapperFactory;
import com.eclipsesource.uml.glsp.uml.features.property_palette.di.PropertyMapperFactory;
import com.eclipsesource.uml.glsp.uml.gmodel.di.GModelMapperFactory;
import com.eclipsesource.uml.glsp.uml.handler.di.NodeOperationHandlerFactory;
import com.eclipsesource.uml.modelserver.unotation.Representation;

public interface DeploymentSpecificationFactory
   extends NodeConfigurationFactory, NodeOperationHandlerFactory, GModelMapperFactory, PropertyMapperFactory,
   LabelEditMapperFactory {
   @Override
   DeploymentSpecificationConfiguration nodeConfiguration(Representation representation);

   @Override
   DeploymentSpecificationNodeMapper gmodel(Representation representation);

   @Override
   DeploymentSpecificationOperationHandler nodeOperationHandler(Representation representation);

   @Override
   DeploymentSpecificationLabelEditMapper labelEditMapper(Representation representation);

   @Override
   DeploymentSpecificationPropertyMapper elementPropertyMapper(Representation representation);
}
