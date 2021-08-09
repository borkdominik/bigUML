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
package com.eclipsesource.uml.modelserver.commands.util;

import java.util.function.Function;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import org.eclipse.emf.common.notify.Notifier;
import org.eclipse.emf.common.util.TreeIterator;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.ecore.resource.Resource;
import org.eclipse.emf.ecore.util.EcoreUtil;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Class;
import org.eclipse.uml2.uml.DataType;
import org.eclipse.uml2.uml.Element;
import org.eclipse.uml2.uml.Model;
import org.eclipse.uml2.uml.NamedElement;
import org.eclipse.uml2.uml.PackageableElement;
import org.eclipse.uml2.uml.Property;
import org.eclipse.uml2.uml.StructuralFeature;
import org.eclipse.uml2.uml.Type;
import org.eclipse.uml2.uml.resource.UMLResource;

public final class UmlSemanticCommandUtil {

   private UmlSemanticCommandUtil() {}

   public static String getSemanticUriFragment(final Element element) {
      return EcoreUtil.getURI(element).fragment();
   }

   public static EObject getElement(final Model umlModel, final String semanticUriFragment) {
      return umlModel.eResource().getEObject(semanticUriFragment);
   }

   public static <C extends Element> C getElement(final Model umlModel, final String semanticUriFragment,
      final java.lang.Class<C> clazz) {
      EObject element = getElement(umlModel, semanticUriFragment);
      return clazz.cast(element);
   }

   public static Model getModel(final URI modelUri, final EditingDomain domain) {
      Resource semanticResource = domain.getResourceSet()
         .getResource(modelUri.trimFileExtension().appendFileExtension(UMLResource.FILE_EXTENSION), false);
      EObject semanticRoot = semanticResource.getContents().get(0);
      if (!(semanticRoot instanceof Model)) {}
      return (Model) semanticRoot;
   }

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

   public static String getNewAssociationEndName(final Class typeClass) {
      String suffix = "s";
      return typeClass.getName().toLowerCase().concat(suffix);
   }

   public static String getNewPropertyName(final Class parentClass) {
      return UmlSemanticCommandUtil.getNewStructuralFeatureName(Property.class, parentClass);
   }

   private static String getNewStructuralFeatureName(
      final java.lang.Class<? extends StructuralFeature> umlStructuralFeature, final Class parentClass) {

      Function<Integer, String> nameProvider = i -> "new" + umlStructuralFeature.getSimpleName() + i;

      int attributeCounter = parentClass.getOwnedAttributes().stream().filter(umlStructuralFeature::isInstance)
         .collect(Collectors.toList()).size();

      return nameProvider.apply(attributeCounter);
   }

   public static String getNewClassName(final Model umlModel) {
      return UmlSemanticCommandUtil.getNewPackageableElementName(Class.class, umlModel);
   }

   private static String getNewPackageableElementName(final java.lang.Class<? extends PackageableElement> umlClassifier,
      final Model umlModel) {
      Function<Integer, String> nameProvider = i -> "New" + umlClassifier.getSimpleName() + i;

      int classifierCounter = umlModel.getPackagedElements().stream().filter(umlClassifier::isInstance)
         .collect(Collectors.toList()).size();

      return nameProvider.apply(classifierCounter);
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

}
