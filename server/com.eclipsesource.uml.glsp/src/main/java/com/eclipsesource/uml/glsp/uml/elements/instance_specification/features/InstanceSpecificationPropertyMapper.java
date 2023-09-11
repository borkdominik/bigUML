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
package com.eclipsesource.uml.glsp.uml.elements.instance_specification.features;

import static org.eclipse.glsp.server.types.GLSPServerException.getOrThrow;

import java.util.Optional;

import org.eclipse.uml2.uml.Classifier;
import org.eclipse.uml2.uml.InstanceSpecification;
import org.eclipse.uml2.uml.Model;
import org.eclipse.uml2.uml.NamedElement;
import org.eclipse.uml2.uml.VisibilityKind;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.features.property_palette.handler.action.UpdateElementPropertyAction;
import com.eclipsesource.uml.glsp.features.property_palette.model.PropertyPalette;
import com.eclipsesource.uml.glsp.uml.elements.instance_specification.InstanceSpecificationConfiguration;
import com.eclipsesource.uml.glsp.uml.elements.instance_specification.InstanceSpecificationOperationHandler;
import com.eclipsesource.uml.glsp.uml.features.property_palette.RepresentationElementPropertyMapper;
import com.eclipsesource.uml.glsp.uml.utils.element.ClassifierUtils;
import com.eclipsesource.uml.glsp.uml.utils.element.VisibilityKindUtils;
import com.eclipsesource.uml.modelserver.uml.elements.instance_specification.commands.UpdateInstanceSpecificationArgument;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class InstanceSpecificationPropertyMapper extends RepresentationElementPropertyMapper<InstanceSpecification> {

   @Inject
   public InstanceSpecificationPropertyMapper(@Assisted final Representation representation) {
      super(representation);
   }

   @Override
   public PropertyPalette map(final InstanceSpecification source) {
      var elementId = idGenerator.getOrCreateId(source);
      var rootId = modelState.getIndex().getRoot().getId();
      var root = getOrThrow(modelState.getIndex().getEObject(rootId), Model.class, null);
      var objects = root.getOwnedElements();
      var classes = ClassifierUtils.extractUMLClasses(objects);
      var items = this.propertyBuilder(InstanceSpecificationConfiguration.Property.class, elementId)
         .text(InstanceSpecificationConfiguration.Property.NAME, "Name", source.getName())
         .choice(
            InstanceSpecificationConfiguration.Property.VISIBILITY_KIND,
            "Visibility",
            VisibilityKindUtils.asChoices(),
            source.getVisibility().getLiteral())
         .chooseReference(
            InstanceSpecificationConfiguration.Property.CLASSIFIER,
            "Owned Classifiers",
            ClassifierUtils.asChoices(classes),
            ClassifierUtils.asReferences(source.getClassifiers(), idGenerator))
         .items();

      return new PropertyPalette(elementId, source.getName(), items);
   }

   @Override
   public Optional<UpdateOperation> map(final UpdateElementPropertyAction action) {
      var property = getProperty(InstanceSpecificationConfiguration.Property.class, action);
      var handler = getHandler(InstanceSpecificationOperationHandler.class, action);
      UpdateOperation operation = null;
      var rootId = modelState.getIndex().getRoot().getId();
      var root = getOrThrow(modelState.getIndex().getEObject(rootId), Model.class, null);
      switch (property) {
         case NAME:
            operation = handler.withArgument(
               UpdateInstanceSpecificationArgument.by()
                  .name(action.getValue())
                  .build());
            break;
         case VISIBILITY_KIND:
            operation = handler.withArgument(
               UpdateInstanceSpecificationArgument.by()
                  .visibilityKind(VisibilityKind.get(action.getValue()))
                  .build());
            break;

         // Should update the existing classifier list with the actual one after selecting the class in the property
         // palette
         case CLASSIFIER:
            operation = handler.withArgument(
               UpdateInstanceSpecificationArgument.by()
                  .classifierId(convertToClassifier(root.getOwnedMember(action.getValue())), idGenerator)
                  .build());
            break;
      }

      return withContext(operation);

   }

   public static Classifier convertToClassifier(final NamedElement existingElement) {
      if (existingElement instanceof Classifier) {
         return (Classifier) existingElement;
      }

      return null; // Return null if the NamedElement is not a Classifier
   }

}
