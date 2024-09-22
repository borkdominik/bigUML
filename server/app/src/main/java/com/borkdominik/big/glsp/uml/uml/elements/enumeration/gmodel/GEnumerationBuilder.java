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
package com.borkdominik.big.glsp.uml.uml.elements.enumeration.gmodel;

import java.util.List;
import java.util.stream.Collectors;

import org.eclipse.uml2.uml.Enumeration;
import org.eclipse.uml2.uml.EnumerationLiteral;

import com.borkdominik.big.glsp.server.core.constants.BGQuotationMark;
import com.borkdominik.big.glsp.server.sdk.cdk.GCModelContext;
import com.borkdominik.big.glsp.server.sdk.cdk.base.GCProvider;
import com.borkdominik.big.glsp.server.sdk.cdk.gmodel.GCModelList;
import com.borkdominik.big.glsp.server.sdk.ui.components.list.GCList;
import com.borkdominik.big.glsp.server.sdk.ui.components.list.GCListItem;
import com.borkdominik.big.glsp.uml.uml.elements.data_type.gmodel.GDataTypeBuilder;
import com.borkdominik.big.glsp.uml.uml.elements.named_element.GCNamedElement;

public class GEnumerationBuilder<TOrigin extends Enumeration> extends GDataTypeBuilder<TOrigin> {

   public GEnumerationBuilder(final GCModelContext context, final TOrigin origin, final String type) {
      super(context, origin, type);
   }

   public List<EnumerationLiteral> enumerationLiterals() {
      return origin.getOwnedLiterals();
   }

   @Override
   protected GCProvider createHeader(final GCModelList<?, ?> container) {
      var namedElementOptions = GCNamedElement.Options.builder()
         .container(container)
         .prefix((BGQuotationMark.quoteDoubleAngle("enumeration")))
         .build();

      return new GCNamedElement<>(context, origin, namedElementOptions);
   }

   @Override
   protected GCProvider createBody(final GCModelList<?, ?> container) {
      var options = GCList.Options.builder()
         .dividerBeforeInserts(true)
         .build();
      var list = new GCList(context, origin, options);

      list.addAll(enumerationLiterals().stream()
         .map(e -> context.mapHandler.handle(e))
         .map(e -> new GCListItem(context, origin, e))
         .collect(Collectors.toList()));

      return list;
   }
}
