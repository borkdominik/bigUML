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
package com.eclipsesource.uml.modelserver.uml.behavior.cross_delete;

import java.util.List;

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.ecore.EStructuralFeature.Setting;

import com.eclipsesource.uml.modelserver.shared.matcher.CrossReferenceProcessor;
import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.uml.behavior.Behavior;

public interface CrossReferenceDeleteBehavior<TElement extends EObject>
   extends Behavior<TElement>, CrossReferenceProcessor<Command> {
   List<Command> crossRemove(ModelContext context, Setting setting, EObject interest);
}
