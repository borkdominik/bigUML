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
package com.eclipsesource.uml.glsp.uml.diagram.package_diagram.features.property_palette;

import java.util.Optional;

import org.eclipse.uml2.uml.Class;
import org.eclipse.uml2.uml.VisibilityKind;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.features.property_palette.handler.action.UpdateElementPropertyAction;
import com.eclipsesource.uml.glsp.features.property_palette.model.PropertyPalette;
import com.eclipsesource.uml.glsp.uml.diagram.package_diagram.diagram.UmlPackage_Class;
import com.eclipsesource.uml.glsp.uml.diagram.package_diagram.handler.operation.uclass.UpdateClassHandler;
import com.eclipsesource.uml.glsp.uml.features.property_palette.BaseDiagramElementPropertyMapper;
import com.eclipsesource.uml.glsp.uml.utils.element.VisibilityKindUtils;
import com.eclipsesource.uml.modelserver.uml.diagram.package_diagram.commands.uclass.UpdateClassArgument;

public class ClassPropertyMapper extends BaseDiagramElementPropertyMapper<Class> {

   @Override
   public PropertyPalette map(final Class source) {
      var elementId = idGenerator.getOrCreateId(source);

      // Some properties are disabled, since the Class element type for the Package diagram does not include the used
      // sub-elements
      var items = this.propertyBuilder(UmlPackage_Class.Property.class, elementId)
         .text(UmlPackage_Class.Property.NAME, "Name", source.getName())
         .bool(UmlPackage_Class.Property.IS_ABSTRACT, "Is abstract", source.isAbstract())
         .choice(
            UmlPackage_Class.Property.VISIBILITY_KIND,
            "Visibility",
            VisibilityKindUtils.asChoices(),
            source.getVisibility().getLiteral())
         .items();

      return new PropertyPalette(elementId, source.getName(), items);
   }

   @Override
   public Optional<UpdateOperation> map(final UpdateElementPropertyAction action) {
      var property = getProperty(UmlPackage_Class.Property.class, action);
      var handler = getHandler(UpdateClassHandler.class, action);
      UpdateOperation operation = null;

      switch (property) {
         case NAME:
            operation = handler.withArgument(
               new UpdateClassArgument.Builder()
                  .name(action.getValue())
                  .get());
            break;
         case IS_ABSTRACT:
            operation = handler.withArgument(
               new UpdateClassArgument.Builder()
                  .isAbstract(Boolean.parseBoolean(action.getValue()))
                  .get());
            break;
         case VISIBILITY_KIND:
            operation = handler.withArgument(
               new UpdateClassArgument.Builder()
                  .visibilityKind(VisibilityKind.get(action.getValue()))
                  .get());
            break;
      }

      return withContext(operation);

   }

}
