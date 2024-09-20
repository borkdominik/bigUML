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
package com.borkdominik.big.glsp.uml.uml.elements.association.features;

public class AssociationPropertyMapper { /*-

   @Inject
   public AssociationPropertyMapper(@Assisted final Enumerator representation) {
      super(representation);
   }

   @Override
   public PropertyPalette map(final Association source) {
      var elementId = idGenerator.getOrCreateId(source);

      var memberEnds = source.getMemberEnds();
      var memberEndFirst = memberEnds.get(0);
      var memberEndFirstId = idGenerator.getOrCreateId(memberEndFirst);
      var memberEndSecond = memberEnds.get(1);
      var memberEndSecondId = idGenerator.getOrCreateId(memberEndSecond);

      List<ElementPropertyItem> items = new ArrayList<>();      items.addAll(this.propertyBuilder(PropertyConfiguration.Property.class, memberEndFirstId)
         .text(PropertyConfiguration.Property.NAME, "Source Name", memberEndFirst.getName())
         .text(PropertyConfiguration.Property.MULTIPLICITY, "Source Multiplicity",
            MultiplicityUtil.getMultiplicity(memberEndFirst))

   .choice(PropertyConfiguration.Property.AGGREGATION,"Source Aggregation",AggregationKindUtils.asChoices(),memberEndFirst.getAggregation().getLiteral()).items());

   items.addAll(this.propertyBuilder(PropertyConfiguration.Property.class,memberEndSecondId).text(PropertyConfiguration.Property.NAME,"Target Name",memberEndSecond.getName())
   .text(PropertyConfiguration.Property.MULTIPLICITY,"Target Multiplicity",MultiplicityUtil.getMultiplicity(memberEndSecond))
   .choice(PropertyConfiguration.Property.AGGREGATION,"Target Aggregation",AggregationKindUtils.asChoices(),memberEndSecond.getAggregation().getLiteral()).items());

   return new PropertyPalette(elementId,"Association",items);
   }

   @Override
   public Optional<UpdateOperation> map(final UpdateElementPropertyAction action) {
      var property = getProperty(AssociationConfiguration.Property.class, action);
      var handler = getHandler(AssociationOperationHandler.class, action);
      UpdateOperation operation = null;

      switch (property) {
         case NAME:
            operation = handler.withArgument(
               UpdateAssociationArgument.by()
                  .name(action.getValue())
                  .build());
            break;
         case VISIBILITY_KIND:
            operation = handler.withArgument(
               UpdateAssociationArgument.by()
                  .visibilityKind(VisibilityKind.get(action.getValue()))
                  .build());
            break;
      }

      return withContext(operation);
   }

   */
}
