/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.modelserver.commands.property;

public class BaseCopyableProperties<S extends CopyableSemanticProperties, N extends CopyableNotationProperties>
   implements CopyableProperties<S, N> {

   protected final S semantic;
   protected final N notation;

   public BaseCopyableProperties(final S semantic, final N notation) {
      this.semantic = semantic;
      this.notation = notation;
   }

   @Override
   public S getSemantic() { return semantic; }

   @Override
   public N getNotation() { return notation; }
}
