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
package com.eclipsesource.uml.glsp.uml.elements.parameter.features;

import java.util.Optional;

import javax.inject.Inject;

import org.eclipse.uml2.uml.Parameter;
import org.eclipse.uml2.uml.ParameterDirectionKind;
import org.eclipse.uml2.uml.ParameterEffectKind;
import org.eclipse.uml2.uml.VisibilityKind;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.core.model.UmlModelServerAccess;
import com.eclipsesource.uml.glsp.features.property_palette.handler.action.UpdateElementPropertyAction;
import com.eclipsesource.uml.glsp.features.property_palette.model.PropertyPalette;
import com.eclipsesource.uml.glsp.uml.elements.parameter.ParameterConfiguration;
import com.eclipsesource.uml.glsp.uml.elements.parameter.ParameterOperationHandler;
import com.eclipsesource.uml.glsp.uml.elements.parameter.utils.ParameterDirectionKindUtils;
import com.eclipsesource.uml.glsp.uml.elements.parameter.utils.ParameterEffectKindUtils;
import com.eclipsesource.uml.glsp.uml.features.property_palette.RepresentationElementPropertyMapper;
import com.eclipsesource.uml.glsp.uml.utils.MultiplicityUtil;
import com.eclipsesource.uml.glsp.uml.utils.element.TypeUtils;
import com.eclipsesource.uml.glsp.uml.utils.element.VisibilityKindUtils;
import com.eclipsesource.uml.modelserver.uml.elements.parameter.commands.UpdateParameterArgument;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.assistedinject.Assisted;

public class ParameterPropertyMapper extends RepresentationElementPropertyMapper<Parameter> {

   @Inject
   public ParameterPropertyMapper(@Assisted final Representation representation) {
      super(representation);
   }

   @Inject
   private UmlModelServerAccess modelServerAccess;

   @Override
   public PropertyPalette map(final Parameter source) {
      var elementId = idGenerator.getOrCreateId(source);

      var items = this.propertyBuilder(ParameterConfiguration.Property.class, elementId)
         .text(ParameterConfiguration.Property.NAME, "Name", source.getName())
         .bool(ParameterConfiguration.Property.IS_EXCEPTION, "Is exception", source.isException())
         .bool(ParameterConfiguration.Property.IS_STREAM, "Is stream", source.isStream())
         .bool(ParameterConfiguration.Property.IS_ORDERED, "Is ordered", source.isOrdered())
         .bool(ParameterConfiguration.Property.IS_UNIQUE, "Is unique", source.isUnique())
         .choice(
            ParameterConfiguration.Property.DIRECTION_KIND,
            "Direction",
            ParameterDirectionKindUtils.asChoices(),
            source.getDirection().getLiteral())
         .choice(
            ParameterConfiguration.Property.EFFECT_KIND,
            "Effect",
            ParameterEffectKindUtils.asChoices(),
            source.getEffect().getLiteral())
         .choice(
            ParameterConfiguration.Property.VISIBILITY_KIND,
            "Visibility",
            VisibilityKindUtils.asChoices(),
            source.getVisibility().getLiteral())
         .choice(
            ParameterConfiguration.Property.TYPE,
            "Type",
            TypeUtils.asChoices(modelServerAccess.getUmlTypeInformation()),
            source.getType() == null ? "" : idGenerator.getOrCreateId(source.getType()))
         .text(ParameterConfiguration.Property.MULTIPLICITY, "Multiplicity", MultiplicityUtil.getMultiplicity(source))

         .items();

      return new PropertyPalette(elementId, source.getName(), items);
   }

   @Override
   public Optional<UpdateOperation> map(final UpdateElementPropertyAction action) {
      var property = getProperty(ParameterConfiguration.Property.class, action);
      var handler = getHandler(ParameterOperationHandler.class, action);
      UpdateOperation operation = null;

      switch (property) {
         case NAME:
            operation = handler.withArgument(
               UpdateParameterArgument.by()
                  .name(action.getValue())
                  .build());
            break;
         case IS_EXCEPTION:
            operation = handler.withArgument(
               UpdateParameterArgument.by()
                  .isException(Boolean.parseBoolean(action.getValue()))
                  .build());
            break;
         case IS_ORDERED:
            operation = handler.withArgument(
               UpdateParameterArgument.by()
                  .isOrdered(Boolean.parseBoolean(action.getValue()))
                  .build());
            break;
         case IS_STREAM:
            operation = handler.withArgument(
               UpdateParameterArgument.by()
                  .isStream(Boolean.parseBoolean(action.getValue()))
                  .build());
            break;
         case IS_UNIQUE:
            operation = handler.withArgument(
               UpdateParameterArgument.by()
                  .isUnique(Boolean.parseBoolean(action.getValue()))
                  .build());
            break;
         case DIRECTION_KIND:
            operation = handler.withArgument(
               UpdateParameterArgument.by()
                  .directionKind(ParameterDirectionKind.get(action.getValue()))
                  .build());
            break;
         case EFFECT_KIND:
            operation = handler.withArgument(
               UpdateParameterArgument.by()
                  .effectKind(ParameterEffectKind.get(action.getValue()))
                  .build());
            break;
         case VISIBILITY_KIND:
            operation = handler.withArgument(
               UpdateParameterArgument.by()
                  .visibilityKind(VisibilityKind.get(action.getValue()))
                  .build());
            break;
         case MULTIPLICITY:
            operation = handler.withArgument(
               UpdateParameterArgument.by()
                  .upperBound(MultiplicityUtil.getUpper(action.getValue()))
                  .lowerBound(MultiplicityUtil.getLower(action.getValue()))
                  .build());
            break;
         case TYPE:
            operation = handler.withArgument(
               UpdateParameterArgument.by()
                  .typeId(action.getValue())
                  .build());
            break;
      }

      return withContext(operation);
   }

}
