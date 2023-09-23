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
package com.eclipsesource.uml.glsp.uml.configuration;

import org.eclipse.emf.ecore.EObject;

public interface ElementConfigurationAccessor extends ElementConfigurationForAccessor {

   Class<? extends EObject> getElementType();

   default <TConfiguration extends ElementConfiguration<?>> TConfiguration configuration() {
      return configurationFor(getElementType());
   }

   default <TConfiguration extends ElementConfiguration<?>> TConfiguration configuration(
      final Class<TConfiguration> configuration) {
      return configurationFor(getElementType(), configuration);
   }
}
