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
package com.eclipsesource.uml.glsp.core.handler.action;

import java.util.List;

import org.eclipse.emfcloud.modelserver.glsp.actions.handlers.AbstractEMSActionHandler;
import org.eclipse.glsp.server.actions.Action;
import org.eclipse.glsp.server.features.core.model.ModelSubmissionHandler;

import com.eclipsesource.uml.glsp.core.model.UmlSourceModelStorage;
import com.google.inject.Inject;

public class UmlRefreshModelActionHandler extends AbstractEMSActionHandler<UmlRefreshModelAction> {

   @Inject
   protected UmlSourceModelStorage sourceModelStorage;
   @Inject
   protected ModelSubmissionHandler submissionHandler;

   @Override
   public List<Action> executeAction(final UmlRefreshModelAction action) {
      // reload models
      sourceModelStorage.loadSourceModel();
      // refresh GModelRoot
      return submissionHandler.submitModel(action.reason);
   }

}
