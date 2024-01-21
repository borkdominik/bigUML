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
package com.eclipsesource.uml.glsp.uml.elements.interface_realization;

import com.eclipsesource.uml.glsp.uml.configuration.di.EdgeConfigurationFactory;
import com.eclipsesource.uml.glsp.uml.elements.interface_realization.features.InterfaceRealizationPropertyMapper;
import com.eclipsesource.uml.glsp.uml.elements.interface_realization.gmodel.InterfaceRealizationGModelMapper;
import com.eclipsesource.uml.glsp.uml.features.property_palette.di.PropertyMapperFactory;
import com.eclipsesource.uml.glsp.uml.gmodel.di.GModelMapperFactory;
import com.eclipsesource.uml.glsp.uml.handler.di.EdgeOperationHandlerFactory;
import com.eclipsesource.uml.modelserver.unotation.Representation;

public interface InterfaceRealizationFactory
   extends EdgeConfigurationFactory, EdgeOperationHandlerFactory, GModelMapperFactory, PropertyMapperFactory {

   @Override
   InterfaceRealizationConfiguration edgeConfiguration(Representation representation);

   @Override
   InterfaceRealizationGModelMapper gmodel(Representation representation);

   @Override
   InterfaceRealizationOperationHandler edgeOperationHandler(Representation representation);

   @Override
   InterfaceRealizationPropertyMapper elementPropertyMapper(Representation representation);
}
