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

import java.util.Optional;

import org.eclipse.uml2.uml.InstanceSpecification;
import org.eclipse.uml2.uml.VisibilityKind;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.features.property_palette.handler.action.UpdateElementPropertyAction;
import com.eclipsesource.uml.glsp.features.property_palette.model.PropertyPalette;
import com.eclipsesource.uml.glsp.uml.elements.instance_specification.InstanceSpecificationConfiguration;
import com.eclipsesource.uml.glsp.uml.elements.instance_specification.InstanceSpecificationOperationHandler;
import com.eclipsesource.uml.glsp.uml.elements.instance_specification.utils.InstanceSpecificationPropertyUtils;
import com.eclipsesource.uml.glsp.uml.features.property_palette.RepresentationElementPropertyMapper;
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

      var items = this.propertyBuilder(InstanceSpecificationConfiguration.Property.class, elementId)
         .text(InstanceSpecificationConfiguration.Property.NAME, "Name", source.getName())
         .choice(
            InstanceSpecificationConfiguration.Property.VISIBILITY_KIND,
            "Visibility",
            VisibilityKindUtils.asChoices(),
            source.getVisibility().getLiteral())
         .reference(
            InstanceSpecificationConfiguration.Property.CLASSIFIER,
            "Owned Classifiers",
            InstanceSpecificationPropertyUtils.classifiersAsReferences(source, idGenerator),
            InstanceSpecificationPropertyUtils.classifiersAsCreateReferences(source, idGenerator,
               InstanceSpecificationConfiguration.Property.CLASSIFIER.name()),
            false,
            true)
         .items();

      return new PropertyPalette(elementId, source.getName(), items);
   }

   @Override
   public Optional<UpdateOperation> map(final UpdateElementPropertyAction action) {
      var property = getProperty(InstanceSpecificationConfiguration.Property.class, action);
      var handler = getHandler(InstanceSpecificationOperationHandler.class, action);
      UpdateOperation operation = null;

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
         case CLASSIFIER:
            operation = handler.withArgument(
               UpdateInstanceSpecificationArgument.by()
                  .classifierId(action.getValue())
                  .build());
            break;
      }

      return withContext(operation);

   }
}
