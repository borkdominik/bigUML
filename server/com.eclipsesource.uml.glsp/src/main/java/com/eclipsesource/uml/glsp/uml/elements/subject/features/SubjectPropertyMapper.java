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
package com.eclipsesource.uml.glsp.uml.elements.subject.features;

import java.util.Optional;

import org.eclipse.uml2.uml.Component;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.features.property_palette.handler.action.UpdateElementPropertyAction;
import com.eclipsesource.uml.glsp.features.property_palette.model.PropertyPalette;
import com.eclipsesource.uml.glsp.uml.elements.subject.SubjectDefaultHandler;
import com.eclipsesource.uml.glsp.uml.elements.subject.SubjectConfiguration;
import com.eclipsesource.uml.glsp.uml.features.property_palette.BaseDiagramElementPropertyMapper;
import com.eclipsesource.uml.modelserver.uml.elements.subject.commands.UpdateSubjectArgument;

public class SubjectPropertyMapper extends BaseDiagramElementPropertyMapper<Component> {

   @Override
   public PropertyPalette map(final Component source) {
      var elementId = idGenerator.getOrCreateId(source);

      var items = this.propertyBuilder(SubjectConfiguration.Property.class, elementId)
         .text(SubjectConfiguration.Property.NAME, "Name", source.getName())
         .items();

      return new PropertyPalette(elementId, source.getName(), items);
   }

   @Override
   public Optional<UpdateOperation> map(final UpdateElementPropertyAction action) {
      var property = getProperty(SubjectConfiguration.Property.class, action);
      var handler = getHandler(SubjectDefaultHandler.class, action);
      UpdateOperation operation = null;

      switch (property) {
         case NAME:
            operation = handler.withArgument(
               new UpdateSubjectArgument.Builder()
                  .name(action.getValue())
                  .get());
            break;
      }

      return withContext(operation);
   }
}
