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
package com.eclipsesource.uml.modelserver.old.diagram.activitydiagram.util;

import java.util.function.Function;
import java.util.stream.Collectors;

import org.eclipse.uml2.uml.ActivityPartition;
import org.eclipse.uml2.uml.Model;
import org.eclipse.uml2.uml.PackageableElement;

public class ActivitySemanticCommandUtil {
   // ACTIVITY DIAGRAM
   public static String getNewPartitionName(final Model umlModel) {
      return getNewPackageableElementName(
         (java.lang.Class<? extends PackageableElement>) ActivityPartition.class, umlModel);
   }

   private static String getNewPackageableElementName(final java.lang.Class<? extends PackageableElement> umlClassifier,
      final Model umlModel) {
      Function<Integer, String> nameProvider = i -> "New" + umlClassifier.getSimpleName() + i;

      int classifierCounter = umlModel.getPackagedElements().stream().filter(umlClassifier::isInstance)
         .collect(Collectors.toList()).size();

      return nameProvider.apply(classifierCounter);
   }

}
