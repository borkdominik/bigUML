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

   protected ElementChoicePropertyItem(final Builder builder) {
      super(builder.elementId, builder.propertyId, ElementPropertyType.CHOICE);

      this.choices = builder.choices;
      this.choice = builder.choice;
      this.label = builder.label;
   }

   public static class Builder {
      protected String elementId;
      protected String propertyId;

      protected String label;
      protected List<ElementChoicePropertyItem.Choice> choices = List.of();
      protected String choice;
      protected Boolean isReadonly;

      public Builder(final String elementId, final String propertyId) {
         super();
         this.elementId = elementId;
         this.propertyId = propertyId;
      }

      public Builder label(final String label) {
         this.label = label;
         return this;
      }

      public Builder choices(final List<ElementChoicePropertyItem.Choice> choices) {
         this.choices = choices;
         return this;
      }

      public Builder choice(final String choice) {
         this.choice = choice;
         return this;
      }

      public Builder isReadonly(final Boolean isReadonly) {
         this.isReadonly = isReadonly;
         return this;
      }

      public ElementChoicePropertyItem build() {
         return new ElementChoicePropertyItem(this);
      }
   }

   public static class Choice {
      public final String label;
      public final String value;
      public final String secondaryText;

      protected Choice(final Builder builder) {
         this.label = builder.label;
         this.value = builder.value;
         this.secondaryText = builder.secondaryText;
      }

      public static class Builder {
         protected String label;
         protected String value;
         protected String secondaryText;

         public Builder(final String label, final String value) {
            super();
            this.label = label;
            this.value = value;
         }

         public Builder secondaryText(final String secondaryText) {
            this.secondaryText = secondaryText;
            return this;
         }

         public Choice build() {
            return new Choice(this);
         }

      }

   }
}
