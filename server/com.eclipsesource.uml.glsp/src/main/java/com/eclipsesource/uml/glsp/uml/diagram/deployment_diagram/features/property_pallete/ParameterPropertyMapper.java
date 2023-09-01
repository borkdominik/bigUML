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
package com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.features.property_pallete;

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
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.diagram.UmlDeployment_Parameter;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.handler.operation.parameter.UpdateParameterHandler;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.utils.MultiplicityUtil;
import com.eclipsesource.uml.glsp.uml.features.property_palette.BaseDiagramElementPropertyMapper;
import com.eclipsesource.uml.glsp.uml.utils.element.ParameterDirectionKindUtils;
import com.eclipsesource.uml.glsp.uml.utils.element.ParameterEffectKindUtils;
import com.eclipsesource.uml.glsp.uml.utils.element.TypeUtils;
import com.eclipsesource.uml.glsp.uml.utils.element.VisibilityKindUtils;
import com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.parameter.UpdateParameterArgument;

public class ParameterPropertyMapper extends BaseDiagramElementPropertyMapper<Parameter> {

   @Inject
   private UmlModelServerAccess modelServerAccess;

   @Override
   public PropertyPalette map(final Parameter source) {
      var elementId = idGenerator.getOrCreateId(source);

      var items = this.propertyBuilder(UmlDeployment_Parameter.Property.class, elementId)
         .text(UmlDeployment_Parameter.Property.NAME, "Name", source.getName())
         .bool(UmlDeployment_Parameter.Property.IS_EXCEPTION, "Is exception", source.isException())
         .bool(UmlDeployment_Parameter.Property.IS_STREAM, "Is stream", source.isStream())
         .bool(UmlDeployment_Parameter.Property.IS_ORDERED, "Is ordered", source.isOrdered())
         .bool(UmlDeployment_Parameter.Property.IS_UNIQUE, "Is unique", source.isUnique())
         .choice(
            UmlDeployment_Parameter.Property.DIRECTION_KIND,
            "Direction",
            ParameterDirectionKindUtils.asChoices(),
            source.getDirection().getLiteral())
         .choice(
            UmlDeployment_Parameter.Property.EFFECT_KIND,
            "Effect",
            ParameterEffectKindUtils.asChoices(),
            source.getEffect().getLiteral())
         .choice(
            UmlDeployment_Parameter.Property.VISIBILITY_KIND,
            "Visibility",
            VisibilityKindUtils.asChoices(),
            source.getVisibility().getLiteral())
         .choice(
            UmlDeployment_Parameter.Property.TYPE,
            "Type",
            TypeUtils.asChoices(modelServerAccess.getUmlTypeInformation()),
            source.getType() == null ? "" : idGenerator.getOrCreateId(source.getType()))
         .text(UmlDeployment_Parameter.Property.MULTIPLICITY, "Multiplicity", MultiplicityUtil.getMultiplicity(source))

         .items();

      return new PropertyPalette(elementId, source.getName(), items);
   }

   @Override
   public Optional<UpdateOperation> map(final UpdateElementPropertyAction action) {
      var property = getProperty(UmlDeployment_Parameter.Property.class, action);
      var handler = getHandler(UpdateParameterHandler.class, action);
      UpdateOperation operation = null;

      switch (property) {
         case NAME:
            operation = handler.withArgument(
               new UpdateParameterArgument.Builder()
                  .name(action.getValue())
                  .get());
            break;
         case IS_EXCEPTION:
            operation = handler.withArgument(
               new UpdateParameterArgument.Builder()
                  .isException(Boolean.parseBoolean(action.getValue()))
                  .get());
            break;
         case IS_ORDERED:
            operation = handler.withArgument(
               new UpdateParameterArgument.Builder()
                  .isOrdered(Boolean.parseBoolean(action.getValue()))
                  .get());
            break;
         case IS_STREAM:
            operation = handler.withArgument(
               new UpdateParameterArgument.Builder()
                  .isStream(Boolean.parseBoolean(action.getValue()))
                  .get());
            break;
         case IS_UNIQUE:
            operation = handler.withArgument(
               new UpdateParameterArgument.Builder()
                  .isUnique(Boolean.parseBoolean(action.getValue()))
                  .get());
            break;
         case DIRECTION_KIND:
            operation = handler.withArgument(
               new UpdateParameterArgument.Builder()
                  .directionKind(ParameterDirectionKind.get(action.getValue()))
                  .get());
            break;
         case EFFECT_KIND:
            operation = handler.withArgument(
               new UpdateParameterArgument.Builder()
                  .effectKind(ParameterEffectKind.get(action.getValue()))
                  .get());
            break;
         case VISIBILITY_KIND:
            operation = handler.withArgument(
               new UpdateParameterArgument.Builder()
                  .visibilityKind(VisibilityKind.get(action.getValue()))
                  .get());
            break;
         case MULTIPLICITY:
            operation = handler.withArgument(
               new UpdateParameterArgument.Builder()
                  .upperBound(MultiplicityUtil.getUpper(action.getValue()))
                  .lowerBound(MultiplicityUtil.getLower(action.getValue()))
                  .get());
            break;
         case TYPE:
            operation = handler.withArgument(
               new UpdateParameterArgument.Builder()
                  .typeId(action.getValue())
                  .get());
            break;
      }

      return withContext(operation);
   }

}
