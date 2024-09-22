/********************************************************************************
 * Copyright (c) 2024 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.borkdominik.big.glsp.uml.uml.elements.type.model;

public class TypeInformation {
   protected String modelUri;
   protected String id;
   protected String name;
   protected String type;

   TypeInformation(final String modelUri, final String id, final String name, final String type) {
      this.modelUri = modelUri;
      this.id = id;
      this.name = name;
      this.type = type;
   }

   public static class TypeInformationBuilder {
      private String modelUri;
      private String id;
      private String name;
      private String type;

      TypeInformationBuilder() {
      }

      public TypeInformation.TypeInformationBuilder modelUri(final String modelUri) {
         this.modelUri = modelUri;
         return this;
      }

      public TypeInformation.TypeInformationBuilder id(final String id) {
         this.id = id;
         return this;
      }

      public TypeInformation.TypeInformationBuilder name(final String name) {
         this.name = name;
         return this;
      }

      public TypeInformation.TypeInformationBuilder type(final String type) {
         this.type = type;
         return this;
      }

      public TypeInformation build() {
         return new TypeInformation(this.modelUri, this.id, this.name, this.type);
      }

      @Override
      public java.lang.String toString() {
         return "TypeInformation.TypeInformationBuilder(modelUri=" + this.modelUri + ", id=" + this.id + ", name=" + this.name + ", type=" + this.type + ")";
      }
   }

   public static TypeInformation.TypeInformationBuilder builder() {
      return new TypeInformation.TypeInformationBuilder();
   }

   public String getModelUri() {
      return this.modelUri;
   }

   public String getId() {
      return this.id;
   }

   public String getName() {
      return this.name;
   }

   public String getType() {
      return this.type;
   }
}
