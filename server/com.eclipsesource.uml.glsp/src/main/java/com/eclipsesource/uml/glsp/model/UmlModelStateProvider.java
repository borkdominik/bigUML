/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.model;

import org.eclipse.glsp.server.model.DefaultModelStateProvider;

import com.google.inject.Singleton;

@Singleton
public class UmlModelStateProvider extends DefaultModelStateProvider {

   @Override
   protected UmlModelState createModelState() {
      return new UmlModelState();
   }

}
