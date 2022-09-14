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
import org.eclipse.uml2.uml.ActivityPartition;
import org.eclipse.uml2.uml.Actor;
import org.eclipse.uml2.uml.Artifact;
import org.eclipse.uml2.uml.Class;
import org.eclipse.uml2.uml.Component;
import org.eclipse.uml2.uml.DataType;
import org.eclipse.uml2.uml.DeploymentSpecification;
import org.eclipse.uml2.uml.Device;
import org.eclipse.uml2.uml.Element;
import org.eclipse.uml2.uml.Enumeration;
import org.eclipse.uml2.uml.ExecutionEnvironment;
import org.eclipse.uml2.uml.InstanceSpecification;
import org.eclipse.uml2.uml.Interaction;
import org.eclipse.uml2.uml.Lifeline;
import org.eclipse.uml2.uml.Message;
import org.eclipse.uml2.uml.Model;
import org.eclipse.uml2.uml.NamedElement;
import org.eclipse.uml2.uml.Node;
import org.eclipse.uml2.uml.Package;
import org.eclipse.uml2.uml.PackageableElement;
import org.eclipse.uml2.uml.Property;
import org.eclipse.uml2.uml.Region;
import org.eclipse.uml2.uml.StateMachine;
import org.eclipse.uml2.uml.StructuralFeature;
import org.eclipse.uml2.uml.Type;
import org.eclipse.uml2.uml.UseCase;
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

   private static String getNewStructuralFeatureName(
      final java.lang.Class<? extends StructuralFeature> umlStructuralFeature, final Class parentClass) {

      Function<Integer, String> nameProvider = i -> "new" + umlStructuralFeature.getSimpleName() + i;

      int attributeCounter = parentClass.getOwnedAttributes().stream().filter(umlStructuralFeature::isInstance)
         .collect(Collectors.toList()).size();

      return nameProvider.apply(attributeCounter);
   }

   // ACTIVITY DIAGRAM
   public static String getNewPartitionName(final Model umlModel) {
      return UmlSemanticCommandUtil.getNewPackageableElementName(
         (java.lang.Class<? extends PackageableElement>) ActivityPartition.class, umlModel);
   }

   // CLASS DIAGRAM
   public static String getNewClassName(final Model umlModel) {
      return UmlSemanticCommandUtil.getNewPackageableElementName(org.eclipse.uml2.uml.Class.class, umlModel);
   }

   public static String getNewAssociationEndName(final Class typeClass) {
      String suffix = "s";
      return typeClass.getName().toLowerCase().concat(suffix);
   }

   public static String getNewPropertyName(final Class parentClass) {
      return UmlSemanticCommandUtil.getNewStructuralFeatureName(Property.class, parentClass);
   }

   public static String getNewEnumerationName(final Model umlModel) {
      return UmlSemanticCommandUtil.getNewPackageableElementName(Enumeration.class, umlModel);
   }

   // OBJECT DIAGRAM
   public static String getNewObjectName(final Model umlModel) {
      return UmlSemanticCommandUtil.getNewPackageableElementName(InstanceSpecification.class, umlModel);
   }

   public static String getNewAttributeName(final Class parentClass) {
      // TODO: add later again!
      /*
       * Function<Integer, String> nameProvider = i -> "NewAttribute" + i + ":VALUE";
       * int counter = parentClass.getOwnedAttributes().size();
       * return nameProvider.apply(counter);
       */
      // System.out.println("NAME PROVIDER: " + nameProvider.apply(counter));
      return UmlSemanticCommandUtil.getNewStructuralFeatureName(Property.class, parentClass);
   }

   // USECASE DIAGRAM
   public static String getNewUseCaseName(final Model umlModel) {
      return UmlSemanticCommandUtil.getNewPackageableElementName(UseCase.class, umlModel);
   }

   public static String getNewActorName(final Model umlModel) {
      return UmlSemanticCommandUtil.getNewPackageableElementName(Actor.class, umlModel);
   }

   /*
    * public static String getNewPackageName(final Model umlModel) {
    * return UmlSemanticCommandUtil.getNewPackageableElementName(Package.class,
    * umlModel);
    * }
    */

   public static String getNewPackageName(final Package container) {
      return UmlSemanticCommandUtil.getNewPackageableElementName(Package.class, container);
   }

   public static String getNewComponentName(final Model umlModel) {
      return UmlSemanticCommandUtil.getNewPackageableElementName(Component.class, umlModel);
   }

   // STATEMACHINE DIAGRAM
   public static String getNewStateMachineName(final Model umlModel) {
      return UmlSemanticCommandUtil.getNewPackageableElementName(StateMachine.class, umlModel);
   }

   public static String getNewStateName(final Region containerRegion) {
      Function<Integer, String> nameProvider = i -> containerRegion.getName() + "NewState_" + i;
      int subVerticesCounter = containerRegion.getSubvertices().size();
      return nameProvider.apply(subVerticesCounter);
   }

   // TODO: check on this later again!
   // public static String getNewRegionName(final StateMachine stateMachine) {
   public static String getNewRegionName(final Model umlModel) {
      return UmlSemanticCommandUtil
         .getNewPackageableElementName((java.lang.Class<? extends PackageableElement>) Region.class, umlModel);
      /*
       * Function<Integer, String> nameProvider = i -> stateMachine.getName() +
       * "NewRegion_" + i;
       * int subVerticesCounter = stateMachine.getRegions().size();
       * return nameProvider.apply(subVerticesCounter);
       */
   }

   public static String getNewVertexName(final Region containerRegion) {
      Function<Integer, String> nameProvider = i -> containerRegion.getName() + "NewVertex_" + i;
      int subVerticesCounter = containerRegion.getSubvertices().size();
      return nameProvider.apply(subVerticesCounter);
   }

   public static String getNewFinalStateName(final Region containerRegion) {
      Function<Integer, String> nameProvider = i -> "NewFinalState_" + i;
      int subVerticesCounter = containerRegion.getSubvertices().size();
      return nameProvider.apply(subVerticesCounter);
   }

   // DEPLOYMENT DIAGRAM
   public static String getNewNodeName(final Model umlModel) {
      return UmlSemanticCommandUtil.getNewPackageableElementName(Node.class, umlModel);
   }

   public static String getNewArtifactName(final Model umlModel) {
      return UmlSemanticCommandUtil.getNewPackageableElementName(Artifact.class, umlModel);
   }

   public static String getNewExecutionEnvironmentName(final Model umlModel) {
      return UmlSemanticCommandUtil.getNewPackageableElementName(ExecutionEnvironment.class, umlModel);
   }

   public static String getNewDeviceName(final Model umlModel) {
      return UmlSemanticCommandUtil.getNewPackageableElementName(Device.class, umlModel);
   }

   public static String getNewDeploymentSpecificationName(final Model umlModel) {
      return UmlSemanticCommandUtil.getNewPackageableElementName(DeploymentSpecification.class, umlModel);
   }

   public static String getNewPackageableElementName(final Model umlModel,
      final java.lang.Class<? extends PackageableElement> clazz) {
      return UmlSemanticCommandUtil.getNewPackageableElementName(clazz, umlModel);
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

   private static String getNewElementName(final java.lang.Class<? extends Element> element, final int size) {
      Function<Integer, String> nameProvider = i -> "New" + element.getSimpleName() + i;
      return nameProvider.apply(size + 1);
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

   public static String getNewInteractionName(final Model umlModel) {
      return UmlSemanticCommandUtil.getNewPackageableElementName(Interaction.class, umlModel);
   }

   public static String getNewLifelineName(final Interaction interaction) {
      return UmlSemanticCommandUtil.getNewElementName(Lifeline.class, interaction.getLifelines().size());
   }

   public static String getNewMessageName(final Interaction interaction) {
      return UmlSemanticCommandUtil.getNewElementName(Message.class, interaction.getMessages().size());
   }

   public static <C extends Element> C getParent(final Model umlModel, final String semanticUriFragment,
      final java.lang.Class<C> clazz) {
      EObject container = UmlSemanticCommandUtil.getElement(umlModel,
         semanticUriFragment, Element.class).eContainer();
      while (!(clazz.isAssignableFrom(container.getClass())) && container != null) {

         container = container.eContainer();

      }

      if (container != null && !(container instanceof Model)) {
         return clazz.cast(container);
      }

      return null;
   }

}
