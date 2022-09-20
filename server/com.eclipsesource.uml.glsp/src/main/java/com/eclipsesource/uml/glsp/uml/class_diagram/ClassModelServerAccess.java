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

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

import org.apache.log4j.Logger;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.ecore.util.EcoreUtil;
import org.eclipse.emfcloud.modelserver.client.Response;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.emfcloud.modelserver.command.CCommandFactory;
import org.eclipse.emfcloud.modelserver.command.CCompoundCommand;
import org.eclipse.emfcloud.modelserver.glsp.EMSModelServerAccess;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.glsp.server.types.ElementAndBounds;
import org.eclipse.glsp.server.types.ElementAndRoutingPoints;
import org.eclipse.glsp.server.types.GLSPServerException;
import org.eclipse.uml2.uml.Activity;
import org.eclipse.uml2.uml.Association;
import org.eclipse.uml2.uml.Class;
import org.eclipse.uml2.uml.Classifier;
import org.eclipse.uml2.uml.Constraint;
import org.eclipse.uml2.uml.Enumeration;
import org.eclipse.uml2.uml.Generalization;
import org.eclipse.uml2.uml.Interface;
import org.eclipse.uml2.uml.NamedElement;
import org.eclipse.uml2.uml.Property;
import org.eclipse.uml2.uml.resource.UMLResource;

import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.modelserver.UmlModelServerClient;
import com.eclipsesource.uml.modelserver.UmlNotationUtil;
import com.eclipsesource.uml.modelserver.commands.activitydiagram.condition.AddConditionCommandContribution;
import com.eclipsesource.uml.modelserver.commands.classdiagram.association.AddAssociationCommandContribution;
import com.eclipsesource.uml.modelserver.commands.classdiagram.association.RemoveAssociationCommandContribution;
import com.eclipsesource.uml.modelserver.commands.classdiagram.association.SetAssociationEndMultiplicityCommandContribution;
import com.eclipsesource.uml.modelserver.commands.classdiagram.association.SetAssociationEndNameCommandContribution;
import com.eclipsesource.uml.modelserver.commands.classdiagram.classinterface.AddInterfaceCommandContribution;
import com.eclipsesource.uml.modelserver.commands.classdiagram.clazz.AddClassCommandContribution;
import com.eclipsesource.uml.modelserver.commands.classdiagram.clazz.RemoveClassCommandContribution;
import com.eclipsesource.uml.modelserver.commands.classdiagram.clazz.SetClassNameCommandContribution;
import com.eclipsesource.uml.modelserver.commands.classdiagram.enumeration.AddEnumerationCommandContribution;
import com.eclipsesource.uml.modelserver.commands.classdiagram.enumeration.RemoveEnumerationCommandContribution;
import com.eclipsesource.uml.modelserver.commands.classdiagram.enumeration.SetEnumerationNameCommandContribution;
import com.eclipsesource.uml.modelserver.commands.classdiagram.generalization.AddClassGeneralizationCommandContribution;
import com.eclipsesource.uml.modelserver.commands.classdiagram.generalization.RemoveClassGeneralizationCommandContribution;
import com.eclipsesource.uml.modelserver.commands.classdiagram.property.AddPropertyCommandContribution;
import com.eclipsesource.uml.modelserver.commands.classdiagram.property.RemovePropertyCommandContribution;
import com.eclipsesource.uml.modelserver.commands.classdiagram.property.SetPropertyBoundsCommandContribution;
import com.eclipsesource.uml.modelserver.commands.classdiagram.property.SetPropertyNameCommandContribution;
import com.eclipsesource.uml.modelserver.commands.classdiagram.property.SetPropertyTypeCommandContribution;
import com.eclipsesource.uml.modelserver.commands.commons.contributions.ChangeBoundsCommandContribution;
import com.eclipsesource.uml.modelserver.commands.commons.contributions.ChangeRoutingPointsCommandContribution;
import com.eclipsesource.uml.modelserver.commands.commons.contributions.RenameElementCommandContribution;
import com.eclipsesource.uml.modelserver.commands.objectdiagram.attribute.AddAttributeCommandContribution;
import com.eclipsesource.uml.modelserver.commands.objectdiagram.attribute.SetAttributeCommandContribution;
import com.eclipsesource.uml.modelserver.unotation.Edge;
import com.eclipsesource.uml.modelserver.unotation.Shape;
import com.google.common.base.Preconditions;

public class ClassModelServerAccess extends EMSModelServerAccess {

   private static final Logger LOGGER = Logger.getLogger(ClassModelServerAccess.class);
   private final UmlModelServerClient modelServerClient;
   protected String notationFileExtension;

   public ClassModelServerAccess(final String sourceURI, final UmlModelServerClient modelServerClient) {
      super(sourceURI, modelServerClient, UMLResource.FILE_EXTENSION);
      Preconditions.checkNotNull(modelServerClient);
      this.notationFileExtension = UmlNotationUtil.NOTATION_EXTENSION;
      this.modelServerClient = modelServerClient;
   }

   @Override
   public EObject getSemanticModel() {
      try {
         return modelServerClient.get(getSemanticURI(), UMLResource.FILE_EXTENSION).thenApply(res -> res.body()).get();
      } catch (InterruptedException | ExecutionException e) {
         LOGGER.error(e);
         throw new GLSPServerException("Error during model loading", e);
      }
   }

   public String getNotationUri() { return baseSourceUri.appendFileExtension(this.notationFileExtension).toString(); }

   public EObject getNotationModel() {
      try {
         return modelServerClient.get(getNotationUri(), FORMAT_XMI).thenApply(res -> res.body()).get();
      } catch (InterruptedException | ExecutionException e) {
         LOGGER.error(e);
         throw new GLSPServerException("Error during model loading", e);
      }
   }

   protected String getSemanticUriFragment(final EObject element) {
      return EcoreUtil.getURI(element).fragment();
   }

   /*
    * Types
    */
   public CompletableFuture<Response<List<String>>> getUmlTypes() {
      return this.modelServerClient.getUmlTypes(getSemanticURI());
   }

   // FIXME
   public CompletableFuture<Response<List<String>>> getUmlBehaviors() {
      // return this.modelServerClient.getUmlBehaviors(getSemanticURI());
      return null;
   }
   // ======= COMMON ========

   /*
    * UML Constraint
    */
   public CompletableFuture<Response<Boolean>> addCondition(final UmlModelState modelState,
      final Optional<GPoint> newPosition,
      final Activity parent,
      final boolean isPrecondition) {
      CCompoundCommand addActivityCompoundCommand = AddConditionCommandContribution
         .create(getSemanticUriFragment(parent), isPrecondition);
      return this.edit(addActivityCompoundCommand);
   }

   public CompletableFuture<Response<Boolean>> setConditionBody(final UmlModelState modelState,
      final Constraint constraint, final String body) {

      // TODO: Check necessity
      /*
       * CCommand renameameCommand = SetBodyCommandContribution.create(getSemanticUriFragment(constraint),
       * body);
       * return this.edit(renameameCommand);
       */
      return null;
   }

   // Change Bounds
   public CompletableFuture<Response<Boolean>> changeBounds(final Map<Shape, ElementAndBounds> changeBoundsMap) {
      CCompoundCommand compoundCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
      compoundCommand.setType(ChangeBoundsCommandContribution.TYPE);
      changeBoundsMap.forEach((shape, elementAndBounds) -> {
         CCommand changeBoundsCommand = ChangeBoundsCommandContribution.create(shape.getSemanticElement().getUri(),
            elementAndBounds.getNewPosition(), elementAndBounds.getNewSize());
         compoundCommand.getCommands().add(changeBoundsCommand);
      });
      return this.edit(compoundCommand);
   }

   // Change Routing Points
   public CompletableFuture<Response<Boolean>> changeRoutingPoints(
      final Map<Edge, ElementAndRoutingPoints> changeBendPointsMap) {
      CCompoundCommand compoundCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
      compoundCommand.setType(ChangeRoutingPointsCommandContribution.TYPE);

      changeBendPointsMap.forEach((edge, elementAndRoutingPoints) -> {
         CCommand changeRoutingPointsCommand = ChangeRoutingPointsCommandContribution.create(
            edge.getSemanticElement().getUri(), elementAndRoutingPoints.getNewRoutingPoints());
         compoundCommand.getCommands().add(changeRoutingPointsCommand);
      });
      return this.edit(compoundCommand);
   }

   /*
    * Renaming
    */
   public CompletableFuture<Response<Boolean>> renameElement(final UmlModelState modelState,
      final NamedElement element, final String name) {

      CCommand renameameCommand = RenameElementCommandContribution.create(getSemanticUriFragment(element),
         name);
      return this.edit(renameameCommand);
   }

   // ================== CONTENT =================

   /*
    * Class
    */
   public CompletableFuture<Response<Boolean>> addClass(final UmlModelState modelState,
      final Optional<GPoint> newPosition,
      final Boolean isAbstract) {

      CCompoundCommand addClassCompoundCommand = AddClassCommandContribution
         .create(newPosition.orElse(GraphUtil.point(0, 0)), isAbstract);
      return this.edit(addClassCompoundCommand);
   }

   public CompletableFuture<Response<Boolean>> removeClass(final UmlModelState modelState,
      final Class classToRemove) {

      String semanticProxyUri = getSemanticUriFragment(classToRemove);
      CCompoundCommand compoundCommand = RemoveClassCommandContribution.create(semanticProxyUri);
      return this.edit(compoundCommand);
   }

   public CompletableFuture<Response<Boolean>> setClassName(final UmlModelState modelState,
      final Class classToRename, final String newName) {

      CCommand setClassNameCommand = SetClassNameCommandContribution.create(getSemanticUriFragment(classToRename),
         newName);
      return this.edit(setClassNameCommand);
   }

   /*
    * Interface
    */
   public CompletableFuture<Response<Boolean>> addInterface(final UmlModelState modelState,
      final Optional<GPoint> newPosition) {

      CCompoundCommand adddInterfaceCompoundCommand = AddInterfaceCommandContribution
         .create(newPosition.orElse(GraphUtil.point(0, 0)));
      return this.edit(adddInterfaceCompoundCommand);
   }

   public CompletableFuture<Response<Boolean>> removeInterface(final UmlModelState modelState,
      final Interface interfaceToRemove) {

      String semanticProxyUri = getSemanticUriFragment(interfaceToRemove);
      CCompoundCommand compoundCommand = RemoveClassCommandContribution.create(semanticProxyUri);
      return this.edit(compoundCommand);
   }

   public CompletableFuture<Response<Boolean>> setInterfaceName(final UmlModelState modelState,
      final Interface interfaceToRename, final String newName) {

      CCommand setInterfaceNameCommand = SetClassNameCommandContribution.create(
         getSemanticUriFragment(interfaceToRename),
         newName);
      return this.edit(setInterfaceNameCommand);
   }

   /*
    * Enumeration
    */
   public CompletableFuture<Response<Boolean>> addEnumeration(final UmlModelState modelState,
      final Optional<GPoint> newPosition) {

      CCompoundCommand addEnumerationCompoundCommand = AddEnumerationCommandContribution
         .create(newPosition.orElse(GraphUtil.point(0, 0)));
      return this.edit(addEnumerationCompoundCommand);
   }

   public CompletableFuture<Response<Boolean>> removeEnumeration(final UmlModelState modelState,
      final Enumeration enumerationToRemove) {

      String semanticProxyUri = getSemanticUriFragment(enumerationToRemove);
      CCompoundCommand compoundCommand = RemoveEnumerationCommandContribution.create(semanticProxyUri);
      return this.edit(compoundCommand);
   }

   public CompletableFuture<Response<Boolean>> setEnumerationName(final UmlModelState modelState,
      final Enumeration enumerationToRename, final String newName) {

      CCommand setEnumerationNameCommand = SetEnumerationNameCommandContribution.create(
         getSemanticUriFragment(enumerationToRename), newName);
      return this.edit(setEnumerationNameCommand);
   }

   /*
    * Property
    */
   public CompletableFuture<Response<Boolean>> addProperty(final UmlModelState modelState,
      final Class parentClass) {

      CCommand addPropertyCommand = AddPropertyCommandContribution.create(getSemanticUriFragment(parentClass));
      return this.edit(addPropertyCommand);
   }

   public CompletableFuture<Response<Boolean>> removeProperty(final UmlModelState modelState,
      final Property propertyToRemove) {

      Class parentClass = (Class) propertyToRemove.eContainer();
      CCommand removePropertyCommand = RemovePropertyCommandContribution
         .create(getSemanticUriFragment(parentClass), getSemanticUriFragment(propertyToRemove));
      return this.edit(removePropertyCommand);
   }

   /*
    * public CompletableFuture<Response<Boolean>> setProperty(final UmlModelState modelState,
    * final Property propertyToRename, final String newName, final String newType, final String newBounds) {
    * CCommand setPropertyNameCommand = SetPropertyBoundsCommandContribution
    * .create(getSemanticUriFragment(propertyToRename), newName, newType, newBounds);
    * return this.edit(setPropertyNameCommand);
    * }
    */

   public CompletableFuture<Response<Boolean>> setPropertyName(final UmlModelState modelState,
      final Property propertyToRename, final String newName) {

      CCommand setPropertyNameCommand = SetPropertyNameCommandContribution
         .create(getSemanticUriFragment(propertyToRename), newName);
      return this.edit(setPropertyNameCommand);
   }

   public CompletableFuture<Response<Boolean>> setPropertyType(final UmlModelState modelState,
      final Property propertyToRename, final String newType) {

      CCommand setPropertyNameCommand = SetPropertyTypeCommandContribution
         .create(getSemanticUriFragment(propertyToRename), newType);
      return this.edit(setPropertyNameCommand);
   }

   public CompletableFuture<Response<Boolean>> setPropertyBounds(final UmlModelState modelState,
      final Property propertyToRename, final String newBounds) {

      CCommand setPropertyNameCommand = SetPropertyBoundsCommandContribution
         .create(getSemanticUriFragment(propertyToRename), newBounds);
      return this.edit(setPropertyNameCommand);
   }

   /*
    * Association
    */
   public CompletableFuture<Response<Boolean>> addAssociation(final UmlModelState modelState,
      final Class sourceClass, final Class targetClass,
      final String keyword) {
      CCompoundCommand addAssociationCompoundCommand = AddAssociationCommandContribution
         .create(getSemanticUriFragment(sourceClass), getSemanticUriFragment(targetClass), keyword);
      return this.edit(addAssociationCompoundCommand);
   }

   public CompletableFuture<Response<Boolean>> removeAssociation(final UmlModelState modelState,
      final Association associationToRemove) {

      String semanticProxyUri = getSemanticUriFragment(associationToRemove);
      CCompoundCommand compoundCommand = RemoveAssociationCommandContribution.create(semanticProxyUri);
      return this.edit(compoundCommand);
   }

   public CompletableFuture<Response<Boolean>> setAssociationEndName(final UmlModelState modelState,
      final Property associationEnd, final String newName) {

      CCommand setClassNameCommand = SetAssociationEndNameCommandContribution.create(
         getSemanticUriFragment(associationEnd), newName);
      return this.edit(setClassNameCommand);
   }

   public CompletableFuture<Response<Boolean>> setAssociationEndMultiplicity(final UmlModelState modelState,
      final Property associationEnd, final String newBounds) {

      CCommand setClassNameCommand = SetAssociationEndMultiplicityCommandContribution.create(
         getSemanticUriFragment(associationEnd), newBounds);
      return this.edit(setClassNameCommand);
   }

   /*
    * Class Generalization
    */
   public CompletableFuture<Response<Boolean>> addClassGeneralization(final UmlModelState modelState,
      final Classifier sourceClass, final Classifier targetClass) {
      System.out.println("REACHES MODELSERVER ACCESS");
      CCompoundCommand addClassGeneralizationCommand = AddClassGeneralizationCommandContribution
         .create(getSemanticUriFragment(sourceClass), getSemanticUriFragment(targetClass));
      System.out.println("SEMANTIC URI FRAGMENTS  source: " + getSemanticUriFragment(sourceClass) + " target: "
         + getSemanticUriFragment(targetClass));
      return this.edit(addClassGeneralizationCommand);
   }

   public CompletableFuture<Response<Boolean>> removeClassGeneralization(final UmlModelState modelState,
      final Generalization generalizationToRemove) {

      String semanticProxyUri = getSemanticUriFragment(generalizationToRemove);
      CCompoundCommand compoundCommand = RemoveClassGeneralizationCommandContribution.create(semanticProxyUri);
      return this.edit(compoundCommand);
   }

   /*
    * ATTRIBUTE
    */
   public CompletableFuture<Response<Boolean>> addAttribute(final UmlModelState modelState,
      final Class parentClass) {

      CCommand addAttributeCommand = AddAttributeCommandContribution.create(getSemanticUriFragment(parentClass));
      return this.edit(addAttributeCommand);
   }

   public CompletableFuture<Response<Boolean>> setAttribute(final UmlModelState modelState,
      final Property attributeToRename, final String newName, final String newType, final String newBounds) {

      CCommand setPropertyNameCommand = SetAttributeCommandContribution
         .create(getSemanticUriFragment(attributeToRename), newName, newType, newBounds);
      return this.edit(setPropertyNameCommand);
   }

}
