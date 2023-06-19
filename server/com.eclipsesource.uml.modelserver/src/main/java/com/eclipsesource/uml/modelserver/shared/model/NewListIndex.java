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
package com.eclipsesource.uml.modelserver.shared.model;

public class NewListIndex {
   public final String elementId;
   public final Integer oldIndex;
   public final Integer newIndex;

   public NewListIndex(final String elementId, final Integer oldIndex, final Integer newIndex) {
      super();
      this.elementId = elementId;
      this.oldIndex = oldIndex;
      this.newIndex = newIndex;
   }

}
