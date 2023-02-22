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
package com.eclipsesource.uml.modelserver.shared.matcher;

import java.util.List;

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.ecore.EStructuralFeature.Setting;

import com.eclipsesource.uml.modelserver.core.utils.reflection.GenericsUtil;
import com.eclipsesource.uml.modelserver.shared.model.ModelContext;

public abstract class BaseCrossReferenceProcessor<TSelf extends EObject> implements CrossReferenceProcessor<Command> {
   protected final Class<TSelf> selfType;

   public BaseCrossReferenceProcessor() {
      this.selfType = GenericsUtil.getClassParameter(getClass(), BaseCrossReferenceProcessor.class, 0);
   }

   @Override
   public List<Command> process(final ModelContext context, final Setting setting, final EObject interest) {
      if (selfType.isInstance(setting.getEObject())) {
         return process(context, setting, selfType.cast(setting.getEObject()), interest);
      }

      return List.of();
   }

   abstract protected List<Command> process(ModelContext context, final Setting setting, final TSelf self,
      final EObject interest);
}
