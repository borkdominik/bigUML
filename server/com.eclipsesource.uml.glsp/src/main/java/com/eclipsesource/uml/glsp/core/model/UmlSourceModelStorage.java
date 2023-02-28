/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.core.model;

import org.eclipse.emfcloud.modelserver.client.SubscriptionListener;
import org.eclipse.emfcloud.modelserver.glsp.notation.integration.EMSNotationSourceModelStorage;
import org.eclipse.glsp.server.actions.ActionDispatcher;

import com.google.inject.Inject;

public class UmlSourceModelStorage extends EMSNotationSourceModelStorage {

   @Inject
   protected UmlModelServerAccess modelServerAccess;

   @Override
   protected void doSubscribe() {
      super.doSubscribe();
      modelServerAccess.subscribe(modelServerAccess.getNotationURI(),
         createSubscriptionListener(modelServerAccess.getNotationURI(), actionDispatcher));
   }

   @Override
   protected SubscriptionListener createSubscriptionListener(final String modelUri,
      final ActionDispatcher actionDispatcher) {
      return new UmlSubscriptionListener(modelUri, actionDispatcher);
   }
}
