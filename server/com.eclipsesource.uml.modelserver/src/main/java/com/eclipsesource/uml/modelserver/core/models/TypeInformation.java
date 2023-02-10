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
package com.eclipsesource.uml.modelserver.core.models;

import java.util.function.Consumer;

public class TypeInformation {
   public String modelUri;
   public String id;

   public String name;
   public String type;

   public TypeInformation() {

   }

   public TypeInformation(final Consumer<TypeInformation> init) {
      super();
      init.accept(this);
   }
}
