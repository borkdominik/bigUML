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
package com.eclipsesource.uml.glsp.uml.class_diagram;

public class ClassModelServerAccess {
   // ================== CONTENT =================
   /*-
   /*
    * Class
    *
   public CompletableFuture<Response<String>> addClass(final UmlModelState modelState,
      final Optional<GPoint> newPosition,
      final Boolean isAbstract) {
   
      CCompoundCommand addClassCompoundCommand = AddClassCommandContribution
         .create(newPosition.orElse(GraphUtil.point(0, 0)), isAbstract);
      return this.edit(addClassCompoundCommand);
   }
   
   public CompletableFuture<Response<String>> removeClass(final UmlModelState modelState,
      final Class classToRemove) {
   
      String semanticProxyUri = getSemanticUriFragment(classToRemove);
      CCompoundCommand compoundCommand = RemoveClassCommandContribution.create(semanticProxyUri);
      return this.edit(compoundCommand);
   }
   
   public CompletableFuture<Response<String>> setClassName(final UmlModelState modelState,
      final Class classToRename, final String newName) {
   
      CCommand setClassNameCommand = SetClassNameCommandContribution.create(getSemanticUriFragment(classToRename),
         newName);
      return this.edit(setClassNameCommand);
   }
   
   /*
    * Interface
    *
   public CompletableFuture<Response<String>> addInterface(final UmlModelState modelState,
      final Optional<GPoint> newPosition) {
   
      CCompoundCommand adddInterfaceCompoundCommand = AddInterfaceCommandContribution
         .create(newPosition.orElse(GraphUtil.point(0, 0)));
      return this.edit(adddInterfaceCompoundCommand);
   }
   
   public CompletableFuture<Response<String>> removeInterface(final UmlModelState modelState,
      final Interface interfaceToRemove) {
   
      String semanticProxyUri = getSemanticUriFragment(interfaceToRemove);
      CCompoundCommand compoundCommand = RemoveClassCommandContribution.create(semanticProxyUri);
      return this.edit(compoundCommand);
   }
   
   public CompletableFuture<Response<String>> setInterfaceName(final UmlModelState modelState,
      final Interface interfaceToRename, final String newName) {
   
      CCommand setInterfaceNameCommand = SetClassNameCommandContribution.create(
         getSemanticUriFragment(interfaceToRename),
         newName);
      return this.edit(setInterfaceNameCommand);
   }
   
   /*
    * Enumeration
    *
   public CompletableFuture<Response<String>> addEnumeration(final UmlModelState modelState,
      final Optional<GPoint> newPosition) {
   
      CCompoundCommand addEnumerationCompoundCommand = AddEnumerationCommandContribution
         .create(newPosition.orElse(GraphUtil.point(0, 0)));
      return this.edit(addEnumerationCompoundCommand);
   }
   
   public CompletableFuture<Response<String>> removeEnumeration(final UmlModelState modelState,
      final Enumeration enumerationToRemove) {
   
      String semanticProxyUri = getSemanticUriFragment(enumerationToRemove);
      CCompoundCommand compoundCommand = RemoveEnumerationCommandContribution.create(semanticProxyUri);
      return this.edit(compoundCommand);
   }
   
   public CompletableFuture<Response<String>> setEnumerationName(final UmlModelState modelState,
      final Enumeration enumerationToRename, final String newName) {
   
      CCommand setEnumerationNameCommand = SetEnumerationNameCommandContribution.create(
         getSemanticUriFragment(enumerationToRename), newName);
      return this.edit(setEnumerationNameCommand);
   }
   
   /*
    * Property
    *
   public CompletableFuture<Response<String>> addProperty(final UmlModelState modelState,
      final Class parentClass) {
   
      CCommand addPropertyCommand = AddPropertyCommandContribution.create(getSemanticUriFragment(parentClass));
      return this.edit(addPropertyCommand);
   }
   
   public CompletableFuture<Response<String>> removeProperty(final UmlModelState modelState,
      final Property propertyToRemove) {
   
      Class parentClass = (Class) propertyToRemove.eContainer();
      CCommand removePropertyCommand = RemovePropertyCommandContribution
         .create(getSemanticUriFragment(parentClass), getSemanticUriFragment(propertyToRemove));
      return this.edit(removePropertyCommand);
   }
   
   /*
    * public CompletableFuture<Response<String>> setProperty(final UmlModelState modelState,
    * final Property propertyToRename, final String newName, final String newType, final String newBounds) {
    * CCommand setPropertyNameCommand = SetPropertyBoundsCommandContribution
    * .create(getSemanticUriFragment(propertyToRename), newName, newType, newBounds);
    * return this.edit(setPropertyNameCommand);
    * }
    *
   
   public CompletableFuture<Response<String>> setPropertyName(final UmlModelState modelState,
      final Property propertyToRename, final String newName) {
   
      CCommand setPropertyNameCommand = SetPropertyNameCommandContribution
         .create(getSemanticUriFragment(propertyToRename), newName);
      return this.edit(setPropertyNameCommand);
   }
   
   public CompletableFuture<Response<String>> setPropertyType(final UmlModelState modelState,
      final Property propertyToRename, final String newType) {
   
      CCommand setPropertyNameCommand = SetPropertyTypeCommandContribution
         .create(getSemanticUriFragment(propertyToRename), newType);
      return this.edit(setPropertyNameCommand);
   }
   
   public CompletableFuture<Response<String>> setPropertyBounds(final UmlModelState modelState,
      final Property propertyToRename, final String newBounds) {
   
      CCommand setPropertyNameCommand = SetPropertyBoundsCommandContribution
         .create(getSemanticUriFragment(propertyToRename), newBounds);
      return this.edit(setPropertyNameCommand);
   }
   
   /*
    * Association
    *
   public CompletableFuture<Response<String>> addAssociation(final UmlModelState modelState,
      final Class sourceClass, final Class targetClass,
      final String keyword) {
      CCompoundCommand addAssociationCompoundCommand = AddAssociationCommandContribution
         .create(getSemanticUriFragment(sourceClass), getSemanticUriFragment(targetClass), keyword);
      return this.edit(addAssociationCompoundCommand);
   }
   
   public CompletableFuture<Response<String>> removeAssociation(final UmlModelState modelState,
      final Association associationToRemove) {
   
      String semanticProxyUri = getSemanticUriFragment(associationToRemove);
      CCompoundCommand compoundCommand = RemoveAssociationCommandContribution.create(semanticProxyUri);
      return this.edit(compoundCommand);
   }
   
   public CompletableFuture<Response<String>> setAssociationEndName(final UmlModelState modelState,
      final Property associationEnd, final String newName) {
   
      CCommand setClassNameCommand = SetAssociationEndNameCommandContribution.create(
         getSemanticUriFragment(associationEnd), newName);
      return this.edit(setClassNameCommand);
   }
   
   public CompletableFuture<Response<String>> setAssociationEndMultiplicity(final UmlModelState modelState,
      final Property associationEnd, final String newBounds) {
   
      CCommand setClassNameCommand = SetAssociationEndMultiplicityCommandContribution.create(
         getSemanticUriFragment(associationEnd), newBounds);
      return this.edit(setClassNameCommand);
   }
   
   /*
    * Class Generalization
    *
   public CompletableFuture<Response<String>> addClassGeneralization(final UmlModelState modelState,
      final Classifier sourceClass, final Classifier targetClass) {
      System.out.println("REACHES MODELSERVER ACCESS");
      CCompoundCommand addClassGeneralizationCommand = AddClassGeneralizationCommandContribution
         .create(getSemanticUriFragment(sourceClass), getSemanticUriFragment(targetClass));
      System.out.println("SEMANTIC URI FRAGMENTS  source: " + getSemanticUriFragment(sourceClass) + " target: "
         + getSemanticUriFragment(targetClass));
      return this.edit(addClassGeneralizationCommand);
   }
   
   public CompletableFuture<Response<String>> removeClassGeneralization(final UmlModelState modelState,
      final Generalization generalizationToRemove) {
   
      String semanticProxyUri = getSemanticUriFragment(generalizationToRemove);
      CCompoundCommand compoundCommand = RemoveClassGeneralizationCommandContribution.create(semanticProxyUri);
      return this.edit(compoundCommand);
   }
   
   /*
    * ATTRIBUTE
    *
   public CompletableFuture<Response<String>> addAttribute(final UmlModelState modelState,
      final Class parentClass) {
   
      CCommand addAttributeCommand = AddAttributeCommandContribution.create(getSemanticUriFragment(parentClass));
      return this.edit(addAttributeCommand);
   }
   
   public CompletableFuture<Response<String>> setAttribute(final UmlModelState modelState,
      final Property attributeToRename, final String newName, final String newType, final String newBounds) {
   
      CCommand setPropertyNameCommand = SetAttributeCommandContribution
         .create(getSemanticUriFragment(attributeToRename), newName, newType, newBounds);
      return this.edit(setPropertyNameCommand);
   }
   */
}
