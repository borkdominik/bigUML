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
package com.eclipsesource.uml.modelserver.old.diagram.objectdiagram.util;

import java.util.function.Function;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import org.eclipse.emf.common.notify.Notifier;
import org.eclipse.emf.common.util.TreeIterator;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Class;
import org.eclipse.uml2.uml.DataType;
import org.eclipse.uml2.uml.InstanceSpecification;
import org.eclipse.uml2.uml.Model;
import org.eclipse.uml2.uml.NamedElement;
import org.eclipse.uml2.uml.PackageableElement;
import org.eclipse.uml2.uml.Property;
import org.eclipse.uml2.uml.StructuralFeature;
import org.eclipse.uml2.uml.Type;

public class ObjectSemanticCommandUtil {

   public static Type getType(final EditingDomain domain, final String typeName) {
      TreeIterator<Notifier> resourceSetContent = domain.getResourceSet().getAllContents();
      while (resourceSetContent.hasNext()) {
         Notifier res = resourceSetContent.next();
         if (res instanceof DataType || res instanceof org.eclipse.uml2.uml.Class) {
            if (res instanceof NamedElement && ((NamedElement) res).getName().equals(typeName)) {
               return (Type) res;
            }
         }
      }
      return null;
   }

   public static String getNewObjectName(final Model umlModel) {
      return getNewPackageableElementName(InstanceSpecification.class, umlModel);
   }

   public static String getNewStructuralFeatureName(
      final java.lang.Class<? extends StructuralFeature> umlStructuralFeature, final Class parentClass) {

      Function<Integer, String> nameProvider = i -> "new" + umlStructuralFeature.getSimpleName() + i;

      int attributeCounter = parentClass.getOwnedAttributes().stream().filter(umlStructuralFeature::isInstance)
         .collect(Collectors.toList()).size();

      return nameProvider.apply(attributeCounter);
   }

   public static String getNewAttributeName(final Class parentClass) {
      // TODO: add later again!
      /*
       * Function<Integer, String> nameProvider = i -> "NewAttribute" + i + ":VALUE";
       * int counter = parentClass.getOwnedAttributes().size();
       * return nameProvider.apply(counter);
       */
      // System.out.println("NAME PROVIDER: " + nameProvider.apply(counter));
      return getNewStructuralFeatureName(Property.class, parentClass);
   }

   private static String multiplicityRegex() {
      return "\\.\\.";
   }

   public static int getLower(final String multiplicityString) {
      return getBound(multiplicityString, 0);
   }

   public static int getUpper(final String multiplicityString) {
      return getBound(multiplicityString, 1);
   }

   private static int getBound(final String multiplicityString, final int index) {
      String result = multiplicityString.trim();
      Pattern pattern = Pattern.compile(multiplicityRegex());
      Matcher matcher = pattern.matcher(multiplicityString);
      if (matcher.find()) {
         result = multiplicityString.split(multiplicityRegex())[index];
      }
      return result.isEmpty() ? 1 : (result.equals("*") ? -1 : Integer.parseInt(result, 10));
   }

   private static String getNewPackageableElementName(final java.lang.Class<? extends PackageableElement> umlClassifier,
      final Model umlModel) {
      Function<Integer, String> nameProvider = i -> "New" + umlClassifier.getSimpleName() + i;

      int classifierCounter = umlModel.getPackagedElements().stream().filter(umlClassifier::isInstance)
         .collect(Collectors.toList()).size();

      return nameProvider.apply(classifierCounter);
   }

}
