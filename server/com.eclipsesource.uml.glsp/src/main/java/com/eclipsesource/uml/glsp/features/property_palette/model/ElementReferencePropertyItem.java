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

import org.eclipse.glsp.server.actions.Action;

public final class ElementReferencePropertyItem extends ElementPropertyItem {

   public final String label;
   public final List<Reference> references;
   public final List<CreateReference> creates;
   public final Boolean isOrderable;
   public final Boolean isAutocomplete;

   protected ElementReferencePropertyItem(final Builder builder) {
      super(builder, ElementPropertyType.REFERENCE);

      this.label = builder.label;
      this.references = builder.references;
      this.creates = builder.creates;
      this.isOrderable = builder.isOrderable;
      this.isAutocomplete = builder.isAutocomplete;
   }

   public static class Builder extends ElementPropertyItem.Builder {

      protected String label = null;
      protected List<Reference> references = List.of();
      protected List<CreateReference> creates = List.of();
      protected Boolean isOrderable = false;
      protected Boolean isAutocomplete = false;

      public Builder(final String elementId, final String propertyId) {
         super(elementId, propertyId);
      }

      public Builder label(final String label) {
         this.label = label;
         return this;
      }

      public Builder references(final List<Reference> references) {
         this.references = references;
         return this;
      }

      public Builder creates(final List<CreateReference> creates) {
         this.creates = creates;
         return this;
      }

      public Builder isOrderable(final Boolean isOrderable) {
         this.isOrderable = isOrderable;
         return this;
      }

      public Builder isAutocomplete(final Boolean isAutocomplete) {
         this.isAutocomplete = isAutocomplete;
         return this;
      }

      @Override
      public ElementReferencePropertyItem build() {
         return new ElementReferencePropertyItem(this);
      }

   }

   public static class Reference {
      public final String elementId;
      public final String label;
      public final String name;
      public final String hint;
      public final List<Action> deleteActions;

      protected Reference(final Builder builder) {
         super();
         this.elementId = builder.elementId;
         this.label = builder.label;
         this.name = builder.name;
         this.hint = builder.hint;
         this.deleteActions = builder.deleteActions;
      }

      public static class Builder {
         protected String elementId;
         protected String label;
         protected String name;
         protected String hint;
         protected List<Action> deleteActions = List.of();

         public Builder(final String elementId, final String label) {
            super();
            this.elementId = elementId;
            this.label = label;
         }

         public Builder name(final String name) {
            this.name = name;
            return this;
         }

         public Builder hint(final String hint) {
            this.hint = hint;
            return this;
         }

         public Builder deleteActions(final List<Action> deleteActions) {
            this.deleteActions = deleteActions;
            return this;
         }

         public Reference build() {
            return new Reference(this);
         }

      }
   }

   public static class CreateReference {
      public final String label;
      public final Action action;

      public CreateReference(final Builder builder) {
         super();
         this.label = builder.label;
         this.action = builder.action;
      }

      public static class Builder {
         protected String label;
         protected Action action;

         public Builder(final String label, final Action action) {
            super();
            this.label = label;
            this.action = action;
         }

         public CreateReference build() {
            return new CreateReference(this);
         }
      }
   }
}
