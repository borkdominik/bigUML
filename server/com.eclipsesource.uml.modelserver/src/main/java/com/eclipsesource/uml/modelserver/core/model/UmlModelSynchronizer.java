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
package com.eclipsesource.uml.modelserver.core.model;

import java.util.concurrent.Callable;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.Semaphore;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;
import java.util.concurrent.atomic.AtomicInteger;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.eclipse.emfcloud.modelserver.emf.common.ModelSynchronizer;

/*
 * The default model sync. does not log exceptions
 */
public class UmlModelSynchronizer implements ModelSynchronizer {

   private static final AtomicInteger COUNTER = new AtomicInteger();

   private final String name = UmlModelSynchronizer.class.getSimpleName() + "-" + COUNTER.incrementAndGet();
   private final Logger log = LogManager.getLogger(name);

   private volatile Thread executorThread;

   private final ExecutorService executor = Executors.newSingleThreadExecutor(runnable -> {
      executorThread = new Thread(runnable, name);
      executorThread.setDaemon(true);
      return executorThread;
   });

   private final Semaphore executionPermits = new Semaphore(100);

   public UmlModelSynchronizer() {
      super();
   }

   /**
    * Shut down the linear execution service. Not exposed to clients but
    * used in tests to avoid piling up threads.
    */
   public void dispose() {
      executor.shutdown();
   }

   @Override
   public void syncExec(final Runnable action) {
      if (isExecutorThread()) {
         // We are re-entering an active execution. Do not post but just go
         action.run();
      } else {
         postAndWait(callable(action));
      }
   }

   private boolean isExecutorThread() { return Thread.currentThread() == executorThread; }

   static Callable<Void> callable(final Runnable runnable) {
      return () -> {
         runnable.run();
         return null;
      };
   }

   @Override
   public Future<Void> asyncExec(final Runnable action) {
      return post(callable(action));
   }

   @SuppressWarnings("checkstyle:IllegalCatch")
   @Override
   public <T> T syncCall(final Callable<T> action) {
      if (isExecutorThread()) {
         // We are re-entering an active execution. Do not post but just go
         try {
            return action.call();
         } catch (Exception e) {
            log.error("Synchronous call failed.", e);
            return null;
         }
      }
      return postAndWait(action);
   }

   @Override
   public <T> Future<T> asyncCall(final Callable<T> action) {
      return post(action);
   }

   private <T> Future<T> post(final Callable<T> action) {
      for (;;) {
         if (executor.isShutdown()) {
            // This may happen if e.g. some background tasks were still running when the client disconnected.
            // This (probably) isn't critical and can be safely ignored.
            log.warn(String.format(
               "Received an action after the synchronizer was stopped. Ignoring action: %s", action));
            return CompletableFuture.failedFuture(new IllegalStateException("Synchronizer shut down"));
         }

         try {
            if (executionPermits.tryAcquire(1, TimeUnit.SECONDS)) {
               return executor.submit(() -> {
                  T result;

                  try {
                     result = action.call();
                  } finally {
                     // Release our execution permit for the next task to pick up
                     executionPermits.release();
                  }

                  return result;
               });
            }

            log.warn(String.format("Queue is currently full; retrying..."));
         } catch (final InterruptedException e) {
            log.error("Interrupted while waiting to post model action.", e);
            return CompletableFuture.failedFuture(e);
         } catch (Exception e) {
            log.error("Post failed.", e);
            return CompletableFuture.failedFuture(e);
         }
      }
   }

   private <T> T postAndWait(final Callable<T> action) {
      Future<T> result = post(action);
      while (true) {
         try {
            return result.get(1, TimeUnit.SECONDS);
         } catch (TimeoutException ex) {
            // FIXME: Should we add a specific timeout? Most actions shouldn't take too long to execute,
            // but if something goes wrong, we may wait forever.
            log.warn("A model action is taking a long time to execute. Keep waiting... " + (ex.getMessage() == null ? ""
               : ex.getMessage()));
         } catch (InterruptedException e) {
            log.error("Interrupted", e);
            return null;
         } catch (ExecutionException e) {
            log.error("Execution Exception", e);
            return null;
         }
      }
   }

}
