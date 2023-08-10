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
package com.eclipsesource.uml.glsp.uml.elements.association.features;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.eclipse.uml2.uml.Association;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.features.property_palette.handler.action.UpdateElementPropertyAction;
import com.eclipsesource.uml.glsp.features.property_palette.model.ElementPropertyItem;
import com.eclipsesource.uml.glsp.features.property_palette.model.PropertyPalette;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.association.UpdateAssociationHandler;
import com.eclipsesource.uml.glsp.uml.elements.association.AssociationConfiguration;
import com.eclipsesource.uml.glsp.uml.elements.property.PropertyConfiguration;
import com.eclipsesource.uml.glsp.uml.features.property_palette.BaseDiagramElementPropertyMapper;
import com.eclipsesource.uml.glsp.uml.utils.MultiplicityUtil;
import com.eclipsesource.uml.modelserver.uml.elements.association.commands.UpdateAssociationArgument;

public class AssociationPropertyMapper extends BaseDiagramElementPropertyMapper<Association> {

   @Override
   public PropertyPalette map(final Association source) {
      var elementId = idGenerator.getOrCreateId(source);

      var memberEnds = source.getMemberEnds();
      var memberEndFirst = memberEnds.get(0);
      var memberEndFirstId = idGenerator.getOrCreateId(memberEndFirst);
      var memberEndSecond = memberEnds.get(1);
      var memberEndSecondId = idGenerator.getOrCreateId(memberEndSecond);

      List<ElementPropertyItem> items = new ArrayList<>();

      items.addAll(this.propertyBuilder(AssociationConfiguration.Property.class, elementId)
         .text(AssociationConfiguration.Property.NAME, "Name", source.getName())
         .items());

      items.addAll(this.propertyBuilder(PropertyConfiguration.Property.class, memberEndFirstId)
         .text(PropertyConfiguration.Property.MULTIPLICITY, "Actor - Member End Multiplicity",
            MultiplicityUtil.getMultiplicity(memberEndFirst))
         .items());

      items.addAll(this.propertyBuilder(PropertyConfiguration.Property.class, memberEndSecondId)
         .text(PropertyConfiguration.Property.MULTIPLICITY, "Use Case - Member End Multiplicity",
            MultiplicityUtil.getMultiplicity(memberEndSecond))
         .items());

      return new PropertyPalette(elementId, "Association", items);
   }

   @Override
   public Optional<UpdateOperation> map(final UpdateElementPropertyAction action) {
      var property = getProperty(AssociationConfiguration.Property.class, action);
      var handler = getHandler(UpdateAssociationHandler.class,
         action);
      UpdateOperation operation = null;

      switch (property) {
         case NAME:
            operation = handler.withArgument(
               new UpdateAssociationArgument.Builder()
                  .name(action.getValue())
                  .get());
            break;
      }

      return withContext(operation);
   }
}
