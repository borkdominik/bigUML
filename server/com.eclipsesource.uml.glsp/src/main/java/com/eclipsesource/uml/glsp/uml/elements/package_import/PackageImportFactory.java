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
package com.eclipsesource.uml.glsp.uml.elements.package_import;

import com.eclipsesource.uml.glsp.uml.configuration.di.EdgeConfigurationFactory;
import com.eclipsesource.uml.glsp.uml.elements.package_import.features.PackageImportPropertyMapper;
import com.eclipsesource.uml.glsp.uml.elements.package_import.gmodel.PackageImportGModelMapper;
import com.eclipsesource.uml.glsp.uml.features.property_palette.di.PropertyMapperFactory;
import com.eclipsesource.uml.glsp.uml.gmodel.di.GModelMapperFactory;
import com.eclipsesource.uml.glsp.uml.handler.di.EdgeOperationHandlerFactory;
import com.eclipsesource.uml.modelserver.unotation.Representation;

public interface PackageImportFactory
   extends EdgeConfigurationFactory, EdgeOperationHandlerFactory, GModelMapperFactory, PropertyMapperFactory {

   @Override
   PackageImportConfiguration edgeConfiguration(Representation representation);

   @Override
   PackageImportGModelMapper gmodel(Representation representation);

   @Override
   PackageImportOperationHandler edgeOperationHandler(Representation representation);

   @Override
   PackageImportPropertyMapper elementPropertyMapper(Representation representation);
}
