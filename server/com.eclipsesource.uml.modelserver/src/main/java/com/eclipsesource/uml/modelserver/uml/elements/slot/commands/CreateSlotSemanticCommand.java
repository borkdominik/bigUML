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
package com.eclipsesource.uml.modelserver.uml.elements.slot.commands;

import org.eclipse.uml2.uml.InstanceSpecification;
import org.eclipse.uml2.uml.Slot;
import org.eclipse.uml2.uml.Type;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseCreateSemanticChildCommand;
import com.eclipsesource.uml.modelserver.uml.elements.slot.utils.SlotUtil;

public final class CreateSlotSemanticCommand extends BaseCreateSemanticChildCommand<InstanceSpecification, Slot> {

   protected final Type defaultType;

   public CreateSlotSemanticCommand(final ModelContext context,
      final InstanceSpecification parent) {
      super(context, parent);
      this.defaultType = SlotUtil.getType(context.domain, "String");
   }

   @Override
   protected Slot createSemanticElement(final InstanceSpecification parent) {
      return parent.createSlot();
   }

}
