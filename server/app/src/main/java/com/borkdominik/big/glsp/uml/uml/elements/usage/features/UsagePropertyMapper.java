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
package com.borkdominik.big.glsp.uml.uml.elements.usage.features;

public class UsagePropertyMapper { /*-

   @Inject
   public UsagePropertyMapper(@Assisted final Enumerator representation) {
      super(representation);
   }

   @Override
   public PropertyPalette map(final Usage source) {
      var elementId = idGenerator.getOrCreateId(source);

      var items = this.propertyBuilder(UsageConfiguration.Property.class, elementId)
         .text(UsageConfiguration.Property.NAME, "Name", source.getName())
         .choice(
            UsageConfiguration.Property.VISIBILITY_KIND,
            "Visibility",
            VisibilityKindUtils.asChoices(),
            source.getVisibility().getLiteral())
         .items();

      return new PropertyPalette(elementId, "Usage", items);
   }

   @Override
   public Optional<UpdateOperation> map(final UpdateElementPropertyAction action) {
      var property = getProperty(UsageConfiguration.Property.class, action);
      var handler = getHandler(UsageOperationHandler.class, action);
      UpdateOperation operation = null;

      switch (property) {
         case NAME:
            operation = handler.withArgument(
               UpdateUsageArgument.by()
                  .name(action.getValue())
                  .build());
            break;
         case VISIBILITY_KIND:
            operation = handler.withArgument(
               UpdateUsageArgument.by()
                  .visibilityKind(VisibilityKind.get(action.getValue()))
                  .build());
            break;
      }

      return withContext(operation);
   }

*/}
