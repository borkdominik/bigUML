/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.uml.elements.property.features;

import java.util.List;
import java.util.stream.Collectors;

import org.eclipse.glsp.server.types.EditorContext;
import org.eclipse.uml2.uml.Property;

import com.eclipsesource.uml.glsp.core.model.UmlModelServerAccess;
import com.eclipsesource.uml.glsp.features.autocomplete.handler.action.AutocompleteEntryAction;
import com.eclipsesource.uml.glsp.uml.features.autocomplete.BaseAutocompleteProvider;
import com.eclipsesource.uml.modelserver.core.models.TypeInformation;
import com.eclipsesource.uml.modelserver.uml.elements.property.commands.UpdatePropertyArgument;
import com.google.inject.Inject;

public class PropertyTypeAutocompleteProvider extends BaseAutocompleteProvider<Property> {

   @Inject
   protected UmlModelServerAccess modelServerAccess;

   @Override
   public List<AutocompleteEntryAction> process(final EditorContext context) {
      var information = modelServerAccess.getUmlTypeInformation();

      return information.stream().map(i -> this.map(context, i))
         .collect(Collectors.toList());
   }

   protected AutocompleteEntryAction map(final EditorContext context, final TypeInformation information) {
      var element = element(context).get();
      var arg = UpdatePropertyArgument.by().typeId(information.id).build();

      return new AutocompleteEntryAction(information.name,
         List.of(asUpdateOperation(element, arg)),
         information.type);
   }

}
