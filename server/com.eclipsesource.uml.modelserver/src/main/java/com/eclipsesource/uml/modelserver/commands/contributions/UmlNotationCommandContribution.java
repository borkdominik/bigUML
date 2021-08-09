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
package com.eclipsesource.uml.modelserver.commands.contributions;

import org.eclipse.emf.common.command.Command;
import org.eclipse.emfcloud.modelserver.edit.command.BasicCommandContribution;

public abstract class UmlNotationCommandContribution extends BasicCommandContribution<Command> {

   public static final String SEMANTIC_PROXI_URI = "semanticProxyUri";
   public static final String POSITION_X = "positionX";
   public static final String POSITION_Y = "positionY";
   public static final String HEIGHT = "height";
   public static final String WIDTH = "weight";

}
