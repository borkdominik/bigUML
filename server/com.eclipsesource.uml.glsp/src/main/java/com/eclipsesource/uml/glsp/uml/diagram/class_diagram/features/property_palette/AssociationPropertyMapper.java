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
package com.eclipsesource.uml.glsp.uml.diagram.class_diagram.features.property_palette;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.eclipse.uml2.uml.Association;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.features.property_palette.handler.action.UpdateElementPropertyAction;
import com.eclipsesource.uml.glsp.features.property_palette.model.ElementPropertyItem;
import com.eclipsesource.uml.glsp.features.property_palette.model.PropertyPalette;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.UmlClass_Property;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.utils.PropertyUtil;
import com.eclipsesource.uml.glsp.uml.features.property_palette.BaseDiagramElementPropertyMapper;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.constants.AssociationType;

public class AssociationPropertyMapper extends BaseDiagramElementPropertyMapper<Association> {

   @Override
   public PropertyPalette map(final Association source) {
      var elementId = idGenerator.getOrCreateId(source);

      var memberEnds = source.getMemberEnds();
      var sourceEnd = memberEnds.get(0);
      var sourceEndId = idGenerator.getOrCreateId(sourceEnd);
      var targetEnd = memberEnds.get(1);
      var targetEndId = idGenerator.getOrCreateId(targetEnd);

      var associationType = AssociationType.from(targetEnd.getAggregation());

      List<ElementPropertyItem> items = new ArrayList<>();

      if (associationType == AssociationType.ASSOCIATION) {
         items = this.<UmlClass_Property.Property> propertyBuilder(elementId)
            .text(sourceEndId, UmlClass_Property.Property.NAME, "Source Name", sourceEnd.getName())
            .text(sourceEndId, UmlClass_Property.Property.MULTIPLICITY, "Source Multiplicity",
               PropertyUtil.getMultiplicity(sourceEnd))
            .text(targetEndId, UmlClass_Property.Property.NAME, "Target Name", targetEnd.getName())
            .text(targetEndId, UmlClass_Property.Property.MULTIPLICITY, "Target Multiplicity",
               PropertyUtil.getMultiplicity(targetEnd))
            .items();
      }

      return new PropertyPalette(elementId, "Association", items);
   }

   @Override
   public Optional<UpdateOperation> map(final UpdateElementPropertyAction action) {
      return withContext(null);
   }

}
