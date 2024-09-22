/********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.borkdominik.big.glsp.uml.uml.elements.dependency.features;

public class DependencyPropertyMapper { /*-

   @Inject
   public DependencyPropertyMapper(@Assisted final Enumerator representation) {
      super(representation);
   }

   @Override
   public PropertyPalette map(final Dependency source) {
      var elementId = idGenerator.getOrCreateId(source);

      var items = this.propertyBuilder(DependencyConfiguration.Property.class, elementId)
         .text(DependencyConfiguration.Property.NAME, "Name", source.getName())
         .choice(
            DependencyConfiguration.Property.VISIBILITY_KIND,
            "Visibility",
            VisibilityKindUtils.asChoices(),
            source.getVisibility().getLiteral())
         .items();

      return new PropertyPalette(elementId, "Abstraction", items);
   }

   @Override
   public Optional<UpdateOperation> map(final UpdateElementPropertyAction action) {
      var property = getProperty(DependencyConfiguration.Property.class, action);
      var handler = getHandler(DependencyOperationHandler.class, action);
      UpdateOperation operation = null;

      switch (property) {
         case NAME:
            operation = handler.withArgument(
               UpdateDependencyArgument.by()
                  .name(action.getValue())
                  .build());
            break;
         case VISIBILITY_KIND:
            operation = handler.withArgument(
               UpdateDependencyArgument.by()
                  .visibilityKind(VisibilityKind.get(action.getValue()))
                  .build());
            break;
      }

      return withContext(operation);
   }

*/}
