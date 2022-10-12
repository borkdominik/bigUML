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
package com.eclipsesource.uml.glsp.old.diagram.activity_diagram.utils;

import java.util.List;
import java.util.stream.Collectors;

import org.eclipse.uml2.uml.Activity;
import org.eclipse.uml2.uml.ExceptionHandler;
import org.eclipse.uml2.uml.ExecutableNode;

public final class ActivityUtil {

   private ActivityUtil() {}

   public static List<ExceptionHandler> getAllExceptionHandlers(final Activity activity) {
      return activity.getOwnedNodes().stream()
         .filter(ExecutableNode.class::isInstance)
         .map(ExecutableNode.class::cast)
         .flatMap(node -> node.getHandlers().stream())
         .collect(Collectors.toList());
   }

}
