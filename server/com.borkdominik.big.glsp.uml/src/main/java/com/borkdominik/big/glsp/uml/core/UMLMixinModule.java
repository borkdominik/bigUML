/********************************************************************************
 * Copyright (c) 2024 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.borkdominik.big.glsp.uml.core;

import com.borkdominik.big.glsp.server.core.BGEMFMixinModule;
import com.borkdominik.big.glsp.server.core.BGMixinModule;
import com.borkdominik.big.glsp.uml.uml.UMLModule;
import com.google.inject.AbstractModule;

public class UMLMixinModule extends AbstractModule {
   @Override
   protected void configure() {
      super.configure();

      install(new BGMixinModule());
      install(new BGEMFMixinModule());

      install(new UMLModule());
   }
}
