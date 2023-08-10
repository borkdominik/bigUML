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
package com.eclipsesource.uml.modelserver.shared.semantic;

import org.eclipse.uml2.uml.Element;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;

public class DestroySemanticElementCommand extends BaseSemanticElementCommand {
   protected final Element semanticElement;

   public DestroySemanticElementCommand(final ModelContext context, final Element semanticElement) {
      super(context);
      this.semanticElement = semanticElement;
   }

   @Override
   protected void doExecute() {
      semanticElement.destroy();
   }

}
