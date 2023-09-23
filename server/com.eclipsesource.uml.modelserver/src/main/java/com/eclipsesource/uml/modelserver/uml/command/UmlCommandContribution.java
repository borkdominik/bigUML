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
package com.eclipsesource.uml.modelserver.uml.command;

import org.eclipse.emf.common.command.Command;
import org.eclipse.emfcloud.modelserver.edit.command.BasicCommandContribution;

import com.google.inject.Inject;
import com.google.inject.Injector;

public abstract class UmlCommandContribution extends BasicCommandContribution<Command> {
   @Inject
   protected Injector injector;
}
