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
package com.eclipsesource.uml.modelserver.old.diagram.usecasediagram.util;

import java.util.function.Function;
import java.util.stream.Collectors;

import org.eclipse.uml2.uml.Actor;
import org.eclipse.uml2.uml.Component;
import org.eclipse.uml2.uml.Model;
import org.eclipse.uml2.uml.Package;
import org.eclipse.uml2.uml.PackageableElement;
import org.eclipse.uml2.uml.UseCase;

public class UseCaseSemanticCommandUtil {
   public static String getNewUseCaseName(final Model umlModel) {
      return getNewPackageableElementName(UseCase.class, umlModel);
   }

   public static String getNewActorName(final Model umlModel) {
      return getNewPackageableElementName(Actor.class, umlModel);
   }

   /*
    * public static String getNewPackageName(final Model umlModel) {
    * return UmlSemanticCommandUtil.getNewPackageableElementName(Package.class,
    * umlModel);
    * }
    */

   public static String getNewPackageName(final Package container) {
      return getNewPackageableElementName(Package.class, container);
   }

   public static String getNewComponentName(final Model umlModel) {
      return getNewPackageableElementName(Component.class, umlModel);
   }

   private static String getNewPackageableElementName(final java.lang.Class<? extends PackageableElement> umlClassifier,
      final Model umlModel) {
      Function<Integer, String> nameProvider = i -> "New" + umlClassifier.getSimpleName() + i;

      int classifierCounter = umlModel.getPackagedElements().stream().filter(umlClassifier::isInstance)
         .collect(Collectors.toList()).size();

      return nameProvider.apply(classifierCounter);
   }

   private static String getNewPackageableElementName(final java.lang.Class<? extends PackageableElement> umlClassifier,
      final Package container) {
      Function<Integer, String> nameProvider = i -> "New" + umlClassifier.getSimpleName() + i;

      int classifierCounter = container.getPackagedElements().stream().filter(umlClassifier::isInstance)
         .collect(Collectors.toList()).size();

      return nameProvider.apply(classifierCounter);
   }

}
