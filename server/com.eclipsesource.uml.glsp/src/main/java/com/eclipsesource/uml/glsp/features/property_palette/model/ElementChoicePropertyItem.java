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
package com.eclipsesource.uml.glsp.features.property_palette.model;

import java.util.List;

public final class ElementChoicePropertyItem extends ElementPropertyItem {

   public final String label;
   public final List<ElementChoicePropertyItem.Choice> choices;
   public final String choice;

   public ElementChoicePropertyItem(final String elementId, final String propertyId, final String label,
      final List<ElementChoicePropertyItem.Choice> choices, final String choice) {
      super(elementId, propertyId, ElementPropertyType.CHOICE);

      this.choices = choices;
      this.choice = choice;
      this.label = label;
   }

   public static class Choice {
      public final String label;
      public final String value;
      public final String secondaryText;

      public Choice(final String label, final String value) {
         this(label, value, null);
      }

      public Choice(final String label, final String value, final String secondaryText) {
         super();
         this.label = label;
         this.value = value;
         this.secondaryText = secondaryText;
      }

   }
}
